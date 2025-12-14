import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { newsExplorerTool, type NewsExplorerParams } from "./tool/news-explorer.js";
import { newsReaderTool, type NewsReaderParams } from "./tool/news-reader.js";
import { newsLatestTool, type NewsLatestParams } from "./tool/news-latest.js";


const serverInfo = {
    name: "Sherlock MCP Server",
    version: process.env.NPM_PACKAGE_VERSION ??
        "unknown"
}

function createServer() {
    const server = new McpServer(serverInfo);

    server.tool(
        newsExplorerTool.name,
        newsExplorerTool.description,
        newsExplorerTool.parameters,
        (params: NewsExplorerParams) => newsExplorerTool.handler(params),
    )
    server.tool(
        newsReaderTool.name,
        newsReaderTool.description,
        newsReaderTool.parameters,
        (params: NewsReaderParams) => newsReaderTool.handler(params),
    )
    server.tool(
        newsLatestTool.name,
        newsLatestTool.description,
        newsLatestTool.parameters,
        (params: NewsLatestParams) => newsLatestTool.handler(params),
    )
    return server;
}

export { createServer };