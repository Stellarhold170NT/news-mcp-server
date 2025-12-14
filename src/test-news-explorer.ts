import { newsExplorerTool } from './mcp/tool/news-explorer.js';

async function runTest() {
    console.log("Testing news-explorer tool...");
    const params = {
        search_q: 'Ô nhiễm không khí hà nội',
        cate_code: 'all' as const,
        media_type: 'all' as const,
        date_format: 'year' as const,
        page: 1
    };

    const result = await newsExplorerTool.handler(params);
    console.log("Result:");
    console.log(JSON.stringify(result, null, 2));
}

runTest().catch(console.error);
