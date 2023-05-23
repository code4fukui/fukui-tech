import { CSV } from "https://js.sabae.cc/CSV.js";

const data = await CSV.fetchJSON("./fukui-tech-detail.csv");
const baseurl = "http://info.pref.fukui.jp/tisan/sangakukan/jitsuwafukui/images/";
for (const d of data) {
  const bin = new Uint8Array(await (await fetch(d.img)).arrayBuffer());
  if (!d.img.startsWith(baseurl)) {
    throw new Error("not starts with " + d.img);
  }
  const path = "images-cache/" + d.img.substring(baseurl.length);
  await Deno.mkdir(path.substring(0, path.lastIndexOf("/")), { recursive: true });
  await Deno.writeFile(path, bin);
  console.log(path);
}
