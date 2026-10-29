import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { answerShop, ChatError } from "./server/geminiChat.ts";

function readBody(req: IncomingMessage, limit: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > limit) {
        reject(new ChatError(413, "Message trop long."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function shopChat(apiKey: string | undefined, model: string): Plugin {
  const handle = async (req: IncomingMessage, res: ServerResponse, next: (error?: unknown) => void) => {
    const url = req.url?.split("?")[0];
    if (url !== "/api/chat") return next();
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: "Utilisez POST." }));
      return;
    }
    try {
      const raw = await readBody(req, 1_500_000);
      const body = JSON.parse(raw) as { messages?: unknown; catalog?: unknown };
      const reply = await answerShop({ apiKey, model, messages: body.messages, catalog: body.catalog });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(reply));
    } catch (error) {
      const status = error instanceof ChatError ? error.status : error instanceof SyntaxError ? 400 : 500;
      const message = error instanceof ChatError || error instanceof SyntaxError
        ? error instanceof SyntaxError
          ? "Message illisible."
          : error.message
        : "Le conseiller est indisponible.";
      res.statusCode = status;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: message }));
    }
  };

  return {
    name: "sntronic-chat",
    configureServer(server) {
      server.middlewares.use(handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [shopChat(env.GEMINI_API_KEY, env.GEMINI_MODEL || "gemini-flash-lite-latest"), tailwindcss(), react()],
  };
});
