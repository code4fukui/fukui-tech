import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { fetchOrLoad } from "https://js.sabae.cc/fetchOrLoad.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const list = [];

const baseurl = "http://info.pref.fukui.jp/tisan/sangakukan/jitsuwafukui/menu/index-50.html";
const html = await fetchOrLoad(baseurl);
const dom = HTMLParser.parse(html);
//const main = dom.querySelectorAll(".second-bycity");
const items = dom.querySelectorAll(".list-box");
for (const i of items) {
  const companyname = i.querySelector(".first-col h3").text;
  const url = new URL(i.querySelector("a").getAttribute("href"), baseurl).href;
  const item = i.querySelector(".second-col h3").text;
  const flg = i.querySelector(".third-col").text.trim();
  list.push({ companyname, url, item, flg });
}
console.log(list);
await Deno.writeTextFile("fukui-tech.csv", CSV.stringify(list));
