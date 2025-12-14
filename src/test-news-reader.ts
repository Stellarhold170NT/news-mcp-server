import { newsReaderTool } from './mcp/tool/news-reader.js';

async function runTest() {
    console.log("Testing news-reader tool...");
    const params = {
        url: 'https://vnexpress.net/chao-em-co-gai-mua-thu-ha-noi-4868897.html'
    };

    const result = await newsReaderTool.handler(params);
    console.log("Result content length:", result.content[0].text.length);
    console.log("Sample content:", result.content[0].text.substring(0, 500));
}

runTest().catch(console.error);
