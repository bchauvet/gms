import puppeteer from 'puppeteer';
import * as fs from 'node:fs';

declare interface Specialization {
  name: string;
  icon: string;
  talents: Talent[];
}

declare interface Talent {
  row: number;
  col: number;
  spell: number;
}

export const getClassTalent = async (class_name: string) => {
  const browser = await puppeteer.launch({ headless: true, defaultViewport: null });
  const page = await browser.newPage();
  await page.goto(
    `https://www.wowhead.com/cata/talent-calc/${class_name.toLowerCase().replace(' ', '-')}/02`,
    {
      waitUntil: 'domcontentloaded',
    },
  );

  await page.waitForSelector('#onetrust-accept-btn-handler');
  await page.click('#onetrust-accept-btn-handler');

  const specializations = await page.evaluate(() => {
    const trees = [] as Specialization[];
    const talent_trees = document.querySelectorAll('.ctc-tree-box');
    talent_trees?.forEach((tree) => {
      const talent_data = [] as Talent[];
      const talent_icons = tree.querySelectorAll('.ctc-tree-talent');
      talent_icons?.forEach((icon) => {
        icon.querySelectorAll('a').forEach((a) => {
          talent_data.push({
            row: Number(icon.getAttribute('data-row')),
            col: Number(icon.getAttribute('data-col')),
            spell: Number(a.getAttribute('href')?.split('spell=').pop()?.split('/')[0]),
          });
        });
      });
      trees.push({
        name: tree.querySelector('.ctc-tree-header')?.querySelector('b')?.textContent || '',
        icon:
          tree
            .querySelector('.ctc-tree-header')
            ?.querySelector('.ctc-tree-header-icon')
            ?.getAttribute('src') || '',
        talents: talent_data,
      });
    });
    return trees;
  });

  const classData = await page.evaluate(() => {
    return {
      id: Number(document.querySelectorAll('.ctc-main')[0]?.getAttribute('data-class-id') || 0),
      icon:
        document
          .querySelectorAll('.ctc-main')[0]
          ?.querySelectorAll('.ctc-main-status-class-name-icon')[0]
          ?.getAttribute('src') || '',
    };
  });

  return {
    ...classData,
    name: class_name,
    specializations: specializations,
  };
};

const classNames = [
  'Druid',
  'Hunter',
  'Mage',
  'Paladin',
  'Priest',
  'Rogue',
  'Shaman',
  'Warlock',
  'Warrior',
  'Death Knight',
];

const data = [];
for (const name of classNames) {
  data.push(await getClassTalent(name));
  console.log(name, ' talents Scrapped');
}
fs.writeFileSync('wow_classes.json', JSON.stringify(data));
