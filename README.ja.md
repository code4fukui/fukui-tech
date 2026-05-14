# fukui-tech

福井県内の企業の高度な製造技術や企業情報を紹介するウェブサイトです。

## デモ

https://code4fukui.github.io/fukui-tech/

## 特徴

- 福井県内企業の最先端の製造技術や製品を紹介します。
- 「世界シェア1位」などの実績や、企業の所在地（市）で技術を絞り込むことができます。
- 画像、キャッチコピー、詳細情報元のリンクとともに、技術をギャラリー形式で表示します。
- すべてのデータと画像をスクレイピングし、ローカルにキャッシュするスクリプトが含まれています。

## セットアップと使用方法

このプロジェクトでは [Deno ランタイム](https://deno.land/) が必要です。

1.  **技術ページの初期リストのスクレイピング:**
    ソースサイトから技術ページの基本リストを取得し、`fukui-tech.csv` として保存します。
    ```sh
    deno run --allow-net --allow-write scrape.js
    ```

2.  **企業および技術の詳細データの抽出:**
    `fukui-tech.csv` を読み込み、各ページにアクセスして詳細情報を抽出し、`fukui-tech-company.csv` と `fukui-tech-detail.csv` を生成します。
    ```sh
    deno run --allow-net --allow-read --allow-write scrape2.js
    ```

3.  **製品画像のダウンロードとキャッシュ:**
    `fukui-tech-detail.csv` を読み込み、すべての製品画像をローカルで使用するために `images-cache/` ディレクトリへダウンロードします。
    ```sh
    deno run --allow-net --allow-read --allow-write downloadCache.js
    ```

4.  **ウェブサイトの表示:**
    Webブラウザで `index.html` を開き、最終的な結果を確認します。

## データソース

データは、福井県の高度な製造技術を紹介するサイト「実は福井の技」からスクレイピングして取得しています。

-   **ソース:** [実は福井の技](http://info.pref.fukui.jp/tisan/sangakukan/jitsuwafukui/)

スクレイピング処理により、以下のオープンデータCSVファイルが生成されます：

-   `fukui-tech-company.csv`: 各企業の詳細情報。
-   `fukui-tech-detail.csv`: 各技術・製品の詳細情報。

## ライセンス

MIT License — 詳細は [LICENSE](LICENSE) を参照してください。
