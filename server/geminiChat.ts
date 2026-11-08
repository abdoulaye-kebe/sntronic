import { GoogleGenAI, Type, type Content, type Part } from "@google/genai";
import { runShopTool, sanitizeCatalog, sanitizeMessages } from "./tools.ts";

export class ChatError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const declarations = [
  {
    name: "search_products",
    description:
      "Cherche dans le catalogue SNTRONIC. À utiliser dès qu’une question porte sur un produit, un prix, un stock, une marque ou une famille.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING, description: "Mot-clé : nom, référence, mesure ou usage. Vide pour tout lister dans un filtre." },
        category: {
          type: Type.STRING,
          description: "Identifiant de famille, si la question en vise une.",
          enum: ["devices", "gateways", "modules", "domotique"],
        },
        connectivity: {
          type: Type.STRING,
          description: "Réseau, si précisé.",
          enum: ["LoRaWAN", "LTE-M", "NB-IoT", "Multi", "Radio", "Filaire"],
        },
        in_stock: { type: Type.BOOLEAN, description: "Vrai pour ne garder que les produits en stock." },
      },
    },
  },
  {
    name: "get_product",
    description: "Ouvre la fiche d’un produit déjà repéré : prix, stock, description et caractéristiques.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        ref: { type: Type.STRING, description: "Slug, référence ou nom exact, par exemple vivid ou S2103." },
      },
      required: ["ref"],
    },
  },
  {
    name: "list_categories",
    description: "Liste les familles du catalogue et le nombre de références dans chacune.",
    parameters: { type: Type.OBJECT, properties: {} },
  },
  {
    name: "shop_terms",
    description: "Donne la TVA, la livraison, les retours, les horaires et le mode de commande.",
    parameters: { type: Type.OBJECT, properties: {} },
  },
];

const systemInstruction = `Tu es le conseiller de la boutique SNTRONIC. Tu réponds en français, en peu de phrases.

Pour un produit, un prix, un stock ou une référence, appelle search_products une seule fois, puis réponds tout de suite. Ce résultat contient déjà le prix, le stock et le slug. N’appelle get_product que si la question demande les caractéristiques ou la description. N’enchaîne pas plusieurs recherches. Pour la livraison, la TVA, les retours ou les horaires, appelle shop_terms une fois, puis réponds. N’invente jamais un prix, un stock ou une référence : recopie uniquement le champ priceTtc, en francs CFA. N’écris jamais un montant en euros. Les prix affichés incluent le transport et la TVA.

Quand tu cites un produit, ajoute un lien markdown [Nom](/produit/slug) avec le slug renvoyé. Propose au plus trois références.

Le catalogue public a quatre rayons : devices, gateways, modules, domotique. Les prix sont ceux de la boutique, pas des tarifs officiels de fabricant. Ne parle pas d’administration, de code d’accès, ni de clé API. Si la question sort du catalogue, ramène vers un de ces rayons.`;

let skipThinking = false;

function failGemini(error: unknown): never {
  const detail = error instanceof Error ? error.message : "";
  if (/API key|api key|permission|unauth/i.test(detail)) {
    throw new ChatError(503, "La clé Gemini est refusée. Vérifiez GEMINI_API_KEY.");
  }
  if (/not found|invalid model|404/i.test(detail)) {
    throw new ChatError(503, "Le modèle Gemini configuré est introuvable. Vérifiez GEMINI_MODEL.");
  }
  if (/high demand|UNAVAILABLE|503/i.test(detail)) {
    throw new ChatError(503, "Gemini est saturé pour le moment. Réessayez dans un instant.");
  }
  throw new ChatError(502, "Le conseiller n’a pas pu joindre Gemini.");
}

function absorb(parts: Part[], incoming: Part) {
  const call = incoming.functionCall;
  if (call?.name) {
    const index = parts.findIndex((part) => {
      if (!part.functionCall?.name) return false;
      if (call.id && part.functionCall.id) return part.functionCall.id === call.id;
      return part.functionCall.name === call.name;
    });
    if (index >= 0) {
      const previous = parts[index];
      parts[index] = {
        ...previous,
        ...incoming,
        functionCall: { ...previous.functionCall, ...call },
        thoughtSignature: incoming.thoughtSignature ?? previous.thoughtSignature,
      };
      return;
    }
  }
  if (incoming.text) {
    const last = parts.at(-1);
    if (last?.text !== undefined && !last.functionCall && Boolean(last.thought) === Boolean(incoming.thought)) {
      last.text += incoming.text;
      if (incoming.thoughtSignature) last.thoughtSignature = incoming.thoughtSignature;
      return;
    }
  }
  parts.push(incoming);
}

async function readStep(
  ai: GoogleGenAI,
  model: string,
  contents: Content[],
  config: Record<string, unknown>,
  onDelta?: (piece: string) => void,
) {
  const stream = await ai.models.generateContentStream({
    model,
    contents,
    config,
  });
  const parts: Part[] = [];
  for await (const chunk of stream) {
    for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
      const hadCall = parts.some((item) => item.functionCall);
      absorb(parts, part);
      if (part.text && !part.thought && !part.functionCall && !hadCall && !parts.some((item) => item.functionCall)) {
        onDelta?.(part.text);
      }
    }
  }
  const calls = parts.flatMap((part) => (part.functionCall?.name ? [part.functionCall] : []));
  const text = parts
    .filter((part) => part.text && !part.thought && !part.functionCall)
    .map((part) => part.text ?? "")
    .join("")
    .trim();
  return { text, calls, parts };
}

export async function answerShop(options: {
  apiKey: string | undefined;
  model: string;
  messages: unknown;
  catalog: unknown;
  onDelta?: (piece: string) => void;
}): Promise<{ reply: string; outils: string[] }> {
  const apiKey = options.apiKey?.trim();
  if (!apiKey) {
    throw new ChatError(503, "Ajoutez GEMINI_API_KEY dans le fichier .env, puis relancez le site.");
  }

  const turns = sanitizeMessages(options.messages);
  const last = turns.at(-1);
  if (!last || last.role !== "user") {
    throw new ChatError(400, "Écrivez une question.");
  }

  const catalog = sanitizeCatalog(options.catalog);
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { timeout: 15000, retryOptions: { attempts: 1 } },
  });
  const contents: Content[] = turns.map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] }));
  const outils: string[] = [];
  const config = {
    systemInstruction,
    maxOutputTokens: 500,
    temperature: 0.3,
    tools: [{ functionDeclarations: declarations }],
  };

  for (let step = 0; step < 3; step += 1) {
    const withThinking = skipThinking ? config : { ...config, thinkingConfig: { thinkingBudget: 0 } };
    let result;
    try {
      result = await readStep(ai, options.model, contents, withThinking, options.onDelta);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "";
      const rejectedThinking = !skipThinking && /thinking|invalid argument/i.test(detail);
      if (rejectedThinking) {
        try {
          result = await readStep(ai, options.model, contents, config, options.onDelta);
          skipThinking = true;
        } catch (retry) {
          failGemini(retry);
        }
      } else {
        failGemini(error);
      }
    }

    if (result.calls.length === 0) {
      if (!result.text) throw new ChatError(502, "Gemini n’a pas renvoyé de réponse.");
      return { reply: result.text, outils };
    }

    contents.push({ role: "model", parts: result.parts });
    contents.push({
      role: "user",
      parts: result.calls.map((call) => {
        const name = call.name ?? "";
        outils.push(name);
        return {
          functionResponse: {
            name,
            id: call.id,
            response: { result: runShopTool(name, call.args, catalog) },
          },
        };
      }),
    });
  }

  throw new ChatError(502, "La recherche dans le catalogue n’a pas abouti. Reformulez la question.");
}
