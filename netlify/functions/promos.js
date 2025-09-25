import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function handler(event, context) {
  try {
    const res = await fetch("https://www.iherb.com/promos");
    const html = await res.text();
    const $ = cheerio.load(html);

    let promos = [];

    $("a").each((i, el) => {
      const link = $(el).attr("href");
      const title = $(el).text().trim();
      const img = $(el).find("img").attr("src");
      const desc = $(el).attr("title") || "Скидка по промоакции";

      if (link && title && title.length > 10 && link.includes("/promos/")) {
        promos.push({
          title,
          desc,
          img: img || "https://via.placeholder.com/300x150.png?text=iHerb+Promo",
          url: `https://www.iherb.com${link}?rcode=KCR0435`
        });
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(promos.slice(0, 10)), // максимум 10 акций
      headers: { "Content-Type": "application/json" }
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify([]) };
  }
}
