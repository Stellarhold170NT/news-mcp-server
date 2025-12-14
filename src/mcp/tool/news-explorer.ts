import { z } from 'zod';

// Define Cate Code Enum
const CATE_CODES = [
    'all',
    'suckhoe',
    'phap-luat',
    'doisong',
    'kinhdoanh',
    'dulich',
    'cong-dong',
    'the-gioi',
    'giaitri',
    'thethao',
    'thoi-su',
    'tam-su',
    'goc-nhin',
    'giao-duc',
    'khoa-hoc-cong-nghe',
    'podcast'
] as const;

// Define Media Type Enum
const MEDIA_TYPES = [
    'all',
    'text',
    'image',
    'video',
    'topic',
    'infographic'
] as const;

// Define Date Format Enum
const DATE_FORMATS = [
    'all',
    'day',
    'week',
    'month',
    'year'
] as const;

// Define parameters schema
const parameters = {
    search_q: z.string().describe("The search query. Spaces will be encoded as %20"),
    cate_code: z.enum(CATE_CODES).default('all').describe(`Category code for filtering. Options: ${CATE_CODES.join(', ')}`),
    media_type: z.enum(MEDIA_TYPES).default('all').describe(`Media type for filtering. Options: ${MEDIA_TYPES.join(', ')}`),
    date_format: z.enum(DATE_FORMATS).default('all').describe(`Date format/range for filtering. Options: ${DATE_FORMATS.join(', ')}`),
    page: z.number().default(1).describe("Page number to fetch"),
};

const parametersSchema = z.object(parameters);
export type NewsExplorerParams = z.infer<typeof parametersSchema>;

function cleanHtmlText(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
}

async function executeNewsExplorer(params: NewsExplorerParams) {
    try {
        const { search_q, cate_code = 'all', media_type = 'all', date_format = 'all', page = 1 } = params;

        // Construct URL
        // https://timkiem.vnexpress.net/?search_f=&search_q=bia&cate_code=tam-su&media_type=all&latest=&fromdate=&todate=&date_format=year&page=1
        const encodedSearchQ = encodeURIComponent(search_q);
        const url = `https://timkiem.vnexpress.net/?search_f=&search_q=${encodedSearchQ}&cate_code=${cate_code}&media_type=${media_type}&latest=&fromdate=&todate=&date_format=${date_format}&page=${page}`;

        console.log(`Fetching URL: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();

        // Parse HTML
        const articles = [];

        const articleRegex = /<article[^>]*class="[^"]*item-news[^"]*"[^>]*>([\s\S]*?)<\/article>/g;

        let match;
        while ((match = articleRegex.exec(html)) !== null) {
            const articleContent = match[0];

            const urlMatch = articleContent.match(/data-url="([^"]*)"/);
            const link = urlMatch ? urlMatch[1] : '';

            const titleMatch = articleContent.match(/<h3 class="title-news"><a[^>]*>([\s\S]*?)<\/a>/);
            const title = titleMatch ? cleanHtmlText(titleMatch[1]) : 'No Title';

            const descMatch = articleContent.match(/<p class="description"><a[^>]*>([\s\S]*?)<\/a>/);
            const description = descMatch ? cleanHtmlText(descMatch[1]) : '';

            const commentMatch = articleContent.match(/<span class="font_icon[^>]*>(\d+)<\/span>/);
            const comments = commentMatch ? parseInt(commentMatch[1], 10) : 0;

            if (link && title) {
                articles.push({
                    title,
                    description,
                    link,
                    comments
                });
            }
        }

        let yamlOutput = `total_articles: ${articles.length}\narticles:\n`;
        articles.forEach(article => {
            yamlOutput += `  - title: "${article.title.replace(/"/g, '\\"')}"\n`;
            yamlOutput += `    link: "${article.link}"\n`;
            yamlOutput += `    description: "${article.description.replace(/"/g, '\\"')}"\n`;
            yamlOutput += `    comments: ${article.comments}\n`;
        });

        return {
            content: [{
                type: "text" as const,
                text: yamlOutput
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

export const newsExplorerTool = {
    name: "news-explorer",
    description: "Search and crawl news articles from VnExpress with advanced filtering options. Allows filtering by query, category, media type, and time. Returns a list of articles with titles, links, descriptions, and comment counts in YAML format.",
    parameters,
    handler: executeNewsExplorer,
} as const;
