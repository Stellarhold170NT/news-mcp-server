import { newsLatestTool } from './mcp/tool/news-latest.js';

async function runTest() {
    console.log("Testing news-latest tool...");
    const params = {
        category: 'tin-moi-nhat' as const
    };

    const result = await newsLatestTool.handler(params);
    console.log("Result content length:", result.content[0].text.length);
    console.log("Sample content:", result.content[0].text.substring(0, 500));
}

runTest().catch(console.error);
