# News MCP Server for VnExpress

A **Model Context Protocol (MCP)** server that enables AI agents (like Claude) to directly interact with VnExpress, Vietnam's most-read electronic newspaper. This server enables searching for news detailedly, reading latest updates via RSS, and parsing full article content in clean text format.

## Features

- **Get Latest News**: Fetch real-time headlines from specific categories (World, Business, Sports, etc.) using RSS feeds.
- **Search & Explore**: deeply search for articles with advanced filters (keywords, time range, media type, categories).
- **Read Content**: Extract clean, readable text from any VnExpress article URL, removing ads, scripts, and clutter for optimal AI processing.

## Installation & Usage

You can use this server directly without installing it manually by using `npx`.

### 1. Prerequisites
- Node.js installed on your machine.

### 2. Configuration for Claude Desktop

Add the following configuration to your Claude Desktop config file (usually located at `%APPDATA%\Claude\claude_desktop_config.json` on Windows or `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "news-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "news-mcp-server-vnexpress",
        "--stdio"
      ]
    }
  }
}
```

Restart Claude Desktop, and the tools will be available.

---

## Available Tools

### 1. `news-latest`
Fetches the latest news headlines from RSS feeds.

*   **Inputs**:
    *   `category` (string, optional): The category to fetch. Default: `tin-moi-nhat` (Latest News).
        *   Options: `the-gioi`, `thoi-su`, `kinh-doanh`, `giai-tri`, `the-thao`, `phap-luat`, `gia-duc`, `suc-khoe`, `doi-song`, `du-lich`, `khoa-hoc-cong-nghe`, `xe`, `y-kien`, `tam-su`, `cuoi`.
*   **Output**: Raw XML content from the RSS feed containing titles, links, pubDates, and summaries.

### 2. `news-explorer`
Search and filter for specific articles.

*   **Inputs**:
    *   `search_q` (string, required): Keywords to search for.
    *   `cate_code` (enum, optional): Filter by category code (e.g., `the-gioi`, `kinhdoanh`). Default: `all`.
    *   `media_type` (enum, optional): Filter by content type (`text`, `image`, `video`, `infographic`). Default: `all`.
    *   `date_format` (enum, optional): Time range (`day`, `week`, `month`, `year`). Default: `all`.
    *   `page` (number, optional): Page number for pagination.
*   **Output**: A YAML-formatted list of articles including title, link, description, and comment count.

### 3. `news_reader`
Reads the full content of a specific article.

*   **Inputs**:
    *   `url` (string, required): The full URL of the VnExpress article.
*   **Output**: Clean, plain text content of the article body. HTML tags, styles, and scripts are stripped out using **Cheerio** to ensure the AI receives only high-quality token-efficient text.

---

## Technical Details

*   **Framework**: Built using the official `@modelcontextprotocol/sdk`.
*   **RSS Parsing**: `news-latest` connects directly to VnExpress RSS endpoints (`https://vnexpress.net/rss/*`).
*   **Web Scraping**: `news-explorer` constructs search queries against `timkiem.vnexpress.net` and parses the HTML results using regex and DOM manipulation.
*   **Content Extraction**: `news_reader` fetches the article HTML and uses **Cheerio** to locate the `<section class="page-detail">`, stripping unnecessary DOM elements (`script`, `style`, `iframe`) to return pure content.

## Development

If you want to modify or build this project locally:

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the project:
    ```bash
    npm run build
    ```
4.  Test locally using the MCP Inspector:
    ```bash
    npm run inspect
    ```

## License
MIT
