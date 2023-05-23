// todo not found http://info.pref.fukui.jp/tisan/sangakukan/jitsuwafukui/city/157.html

import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { fetchOrLoad } from "https://js.sabae.cc/fetchOrLoad.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { ArrayUtil } from "https://js.sabae.cc/ArrayUtil.js";

const html2text = (text) => {
  if (!text) {
    return "";
  }
  return text.split("\n").map(s => s.trim().replace(/\<br\>/g, "\n")).join("");
};

const localgovs = await CSV.fetchJSON("https://code4fukui.github.io/localgovjp/localgovjp-utf8.csv");
//console.log(localgovs);
const cities = localgovs.filter(l => l.pref == "福井県").map(l => l.city);
//console.log(cities);
const getCity = (adr) => cities.find(c => adr.indexOf(c) >= 0);
//console.log(getCity("福井県鯖江市"));

const list = await CSV.fetchJSON("./fukui-tech.csv");
const urls = ArrayUtil.toUnique(list.map(i => i.url));
console.log(urls);

const companies = [];
const techs = [];

const bugfix = (html) => {
  html = html.replace("<be>", "<br>");
  html = html.replace("<td>代表取締役社長 岡本 直用</td>", "<td>代表取締役社長 岡本 直用</td></tr>");
  html = html.replace(`target="_blank"https:`, `target="_blank">https:`);
  return html;
};

const parseCompany = async (url) => {
  const html = bugfix(await fetchOrLoad(url));
  const dom = HTMLParser.parse(html);

  const item = {};
  const h1 = dom.querySelector(".company-banner .col-lg-6 h1");
  if (!h1) {
    console.log("not found", url);
    return { company: null };
  }

  item.companyname = h1.text;
  item.industry = dom.querySelector(".company-industry p").text;
  item.tagline = html2text(dom.querySelector(".comp_hero p").text);
  item.description = html2text(dom.querySelector(".company-banner .blue-box-text p").text);
  const contacts = dom.querySelectorAll(".company-third .contact-list div");
  const map1 = {
    住所: "address",
    TEL: "tel",
    FAX: "fax",
    URL: "url",
    "E-mail": "mail",
    事業所: "office",
    "本社・工場": "address",
    //"本社": "address",
    "本社": "headoffice",
    "熊坂工場": "branch",
    "併設直営店": "shop",
    あわら工場: "branch",
    経編事業部TEL: "tel",
    経編事業部FAX: "fax",
    製品事業部TEL: "tel2",
    製品事業部FAX: "fax2",
  };
  for (const c of contacts) {
    const pp = c.querySelector("p");
    if (!pp) {
      continue;
    }
    const p = pp.text;
    const name = map1[p];
    if (!name) {
      throw new Error(url + " " + p);
    }
    const v = html2text(c.querySelector("span").text);
    if (name == "address") {
      const adr = v.substring(10);
      item.city = getCity(adr);
      item.zipcode = v.substring(1, 9);
      item[name] = adr;
    } else {
      item[name] = v;
    }
  }

  const infos = dom.querySelectorAll(".company-third .contct-secn-col tr");
  const map = {
    代表者: "president",
    連絡担当者: "contact",
    設立: "establishment",
    創立: "establishment",
    資本金: "year_capital",
    事業内容: "description",
    従業員数: "n_employees",
    売上高: "amount_sales",
    主要取引先: "main_client",
    創業: "start_business",
    県内工場開設: "start_branch",
    海外事業所: "oversea_branch",
  }
  for (const info of infos) {
    const name0 = info.querySelector("th").text;
    if (!name0) {
      continue;
    }
    const name = map[name0];
    if (!name) {
      throw new Error("not match: " + name0);
    }
    item[name] = html2text(info.querySelector("td").text);
  }
  item.message = html2text(dom.querySelector(".company-third .blue-box-text p")?.text);
  item.srcurl = url;

  // product
  const ps = dom.querySelectorAll(".companu-second");
  const tech = [];
  for (const p of ps) {
    const pitem = {};
    const h2 = p.querySelector("h2");
    if (!h2) continue;
    const top = p.querySelectorAll(".top-btns div");
    pitem.techname = html2text(h2.text);
    pitem.tag = top.length > 1 ? top[1].text : "";
    pitem.category = top[0].text;
    pitem.companyname = item.companyname;
    pitem.img = new URL(p.querySelector(".comp_conts img").getAttribute("src"), url).href;
    const conts = p.querySelectorAll(".comp_conts > div")[1];
    pitem.tagline = conts.querySelector("h3").text;
    pitem.description = html2text(conts.querySelector("p").text);
    pitem.srcurl = url;
    tech.push(pitem);
  }
  return { company: item, tech };
};

//await parseCompany("http://info.pref.fukui.jp/tisan/sangakukan/jitsuwafukui/sports/126.html");
//await parseCompany("http://info.pref.fukui.jp/tisan/sangakukan/jitsuwafukui/smartphone/145.html");
//await parseCompany("http://info.pref.fukui.jp/tisan/sangakukan/jitsuwafukui/fashion/130.html");
//await parseCompany("http://info.pref.fukui.jp/tisan/sangakukan/jitsuwafukui/medical/182.html");
//Deno.exit(0);

for (const url of urls) {
  console.log(url);
  const { company, tech } = await parseCompany(url);
  if (company) {
    companies.push(company);
    tech.forEach(p => techs.push(p));
  }
}
await Deno.writeTextFile("fukui-tech-company.csv", CSV.stringify(companies));
await Deno.writeTextFile("fukui-tech-detail.csv", CSV.stringify(techs));
