import { z } from 'zod';

// Define RSS Feeds Map
export const RSS_FEEDS = {
    'trang-chu': 'https://vnexpress.net/rss/tin-moi-nhat.rss',
    'the-gioi': 'https://vnexpress.net/rss/the-gioi.rss',
    'thoi-su': 'https://vnexpress.net/rss/thoi-su.rss',
    'kinh-doanh': 'https://vnexpress.net/rss/kinh-doanh.rss',
    'startup': 'https://vnexpress.net/rss/startup.rss',
    'giai-tri': 'https://vnexpress.net/rss/giai-tri.rss',
    'the-thao': 'https://vnexpress.net/rss/the-thao.rss',
    'phap-luat': 'https://vnexpress.net/rss/phap-luat.rss',
    'giao-duc': 'https://vnexpress.net/rss/giao-duc.rss',
    'tin-moi-nhat': 'https://vnexpress.net/rss/tin-moi-nhat.rss',
    'tin-noi-bat': 'https://vnexpress.net/rss/tin-noi-bat.rss',
    'suc-khoe': 'https://vnexpress.net/rss/suc-khoe.rss',
    'doi-song': 'https://vnexpress.net/rss/gia-dinh.rss',
    'du-lich': 'https://vnexpress.net/rss/du-lich.rss',
    'khoa-hoc-cong-nghe': 'https://vnexpress.net/rss/khoa-hoc-cong-nghe.rss',
    'xe': 'https://vnexpress.net/rss/oto-xe-may.rss',
    'y-kien': 'https://vnexpress.net/rss/y-kien.rss',
    'tam-su': 'https://vnexpress.net/rss/tam-su.rss',
    'cuoi': 'https://vnexpress.net/rss/cuoi.rss',
    'tin-xem-nhieu': 'https://vnexpress.net/rss/tin-xem-nhieu.rss',
} as const;

const CATEGORIES = Object.keys(RSS_FEEDS) as [keyof typeof RSS_FEEDS, ...Array<keyof typeof RSS_FEEDS>];

// Define parameters schema
const parameters = {
    category: z.enum(CATEGORIES).default('tin-moi-nhat').describe(`The category of news to fetch. Options: ${CATEGORIES.join(', ')}`),
};

const parametersSchema = z.object(parameters);
export type NewsLatestParams = z.infer<typeof parametersSchema>;

async function executeNewsLatest(params: NewsLatestParams) {
    try {
        const { category } = params;
        const url = RSS_FEEDS[category];
        console.log(`Fetching RSS URL: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch RSS: ${response.status} ${response.statusText}`);
        }

        const content = await response.text();

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

export const newsLatestTool = {
    name: "news-latest",
    description: "Fetch the latest news headlines from VnExpress RSS feeds. Returns raw XML content containing titles, links, and summaries. Useful for getting a quick overview of what's happening in specific categories.",
    parameters,
    handler: executeNewsLatest,
} as const;
