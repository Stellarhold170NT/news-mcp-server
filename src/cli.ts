#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "dotenv";
import { resolve } from "path";
import { createServer } from "./mcp/index.js";

config({ path: resolve(process.cwd(), ".env") });

export async function startServer(): Promise<void> {
    const isStdioMode = process.env.NODE_ENV === "cli" || process.argv.includes("--stdio");

    const server = createServer();

    if (isStdioMode) {
        const transport = new StdioServerTransport();
        await server.connect(transport);
    }
    else {
        process.exit(1);
    }
}

if (process.argv[1]) {
    startServer().catch((error) => {
        process.exit(1);
    })
}