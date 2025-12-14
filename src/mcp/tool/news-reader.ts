import { z } from 'zod';
import * as cheerio from 'cheerio';

// Define parameters schema
const parameters = {
    url: z.string().url().describe("The URL of the news article to read"),
};

const parametersSchema = z.object(parameters);
export type NewsReaderParams = z.infer<typeof parametersSchema>;

async function executeNewsReader(params: NewsReaderParams) {
    try {
        const { url } = params;
        console.log(`Reading URL: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Find the section with class 'page-detail'
        // We use finding the section that contains 'page-detail' class
        const section = $('section.page-detail');

        let content = "";
        if (section.length > 0) {
            const node = section.first();

            // Remove unwanted elements
            node.find('script, style, noscript, iframe, link, meta').remove();

            // Preserve structure for paragraphs and line breaks
            node.find('br').replaceWith('\n');
            node.find('p, h1, h2, h3, h4, h5, h6, div, article').each((_, el) => {
                $(el).append('\n');
            });

            content = node.text();

            content = content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join('\n\n');

        } else {
            content = "Could not find section with class 'page-detail' in the provided URL.";
        }

        return {
            content: [{
                type: "text" as const,
                text: content
            }],
        };

    } catch (error: any) {
        return {
            content: [{
                type: "text" as const,
                text: `Error: ${error.message}`
            }],
            isError: true
        };
    }
}

export const newsReaderTool = {
    name: "news_reader",
    description: "Read the full content of a specific news article from a VnExpress URL. Extracts clean, readable text from the article's main body (stripping HTML tags, scripts, and ads). Use this to get the details of an article found via news-explorer or news-latest.",
    parameters,
    handler: executeNewsReader,
} as const;
