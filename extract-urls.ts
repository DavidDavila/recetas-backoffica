const puppeteer = require('puppeteer');
const fs = require('fs');

let page: any = undefined;
(async () => {
  const browser = await puppeteer.launch({ devtools: true, headless: true });
  page = await browser.newPage();
  await page.goto('https://www.bonviveur.es/recetas/');
  let cont = 1;
  const maxPages = await page.evaluate(() =>
    Number(
      (document.querySelector('a.page:last-child') as HTMLLinkElement)
        ?.textContent
    )
  );

  let urls: string[] = [];
  while (cont <= maxPages) {
    urls = [...urls, ...(await getHrefs())];
    await page.evaluate(() =>
      (
        document.querySelector('span.page.selected')
          ?.nextElementSibling as HTMLLinkElement
      )?.click()
    );
    console.log(cont);
    cont++;
  }
  const data = JSON.stringify({ urls: urls.sort() });
  fs.writeFile('./src/assets/urls-recipes.json', data, (err: any) => {
    if (err) console.log(err);
    else {
    }
  });
})();

async function getHrefs() {
  await page.waitForSelector('.grid__item.card');
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.grid__item.card')).map(
      (elem) => elem?.querySelector('a')?.href
    );
  });
}
