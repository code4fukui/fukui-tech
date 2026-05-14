# fukui-tech

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A website that introduces advanced manufacturing technologies and company information of enterprises in Fukui Prefecture, Japan.

## Demo

https://code4fukui.github.io/fukui-tech/

## Features

-   Showcases cutting-edge manufacturing technologies and products from Fukui-based companies.
-   Allows filtering technologies by distinctions (e.g., "World Share No. 1") and by company location (city).
-   Displays a gallery of technologies with images, taglines, and links to the original source for full details.
-   Includes scripts to scrape and cache all data and images locally.

## Setup and Usage

This project requires the [Deno runtime](https://deno.land/).

1.  **Scrape the initial list of technology pages:**
    This script gathers the primary list of technology pages from the source website and saves it as `fukui-tech.csv`.
    ```sh
    deno run --allow-net --allow-write scrape.js
    ```

2.  **Extract detailed company and technology data:**
    This script reads `fukui-tech.csv`, visits each page to extract detailed information, and generates `fukui-tech-company.csv` and `fukui-tech-detail.csv`.
    ```sh
    deno run --allow-net --allow-read --allow-write scrape2.js
    ```

3.  **Download and cache product images:**
    This script reads `fukui-tech-detail.csv` and downloads all product images into the `images-cache/` directory for local use.
    ```sh
    deno run --allow-net --allow-read --allow-write downloadCache.js
    ```

4.  **View the website:**
    Open `index.html` in your web browser to see the final result.

## Data Source

The data is sourced by scraping the "Jitsu wa Fukui" (実は福井の技) website, an introduction site for advanced manufacturing technologies in Fukui Prefecture.

-   **Source:** [実は福井の技](http://info.pref.fukui.jp/tisan/sangakukan/jitsuwafukui/)

The scraping process generates the following open data CSV files:

-   `fukui-tech-company.csv`: Detailed information about each company.
-   `fukui-tech-detail.csv`: Detailed information about each technology/product.

## License

MIT License — see [LICENSE](LICENSE).