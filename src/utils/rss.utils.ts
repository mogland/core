/*
 * @FilePath: /GS-server/src/utils/rss.utils.ts
 * @author: Wibus
 * @Date: 2022-03-19 21:22:18
 * @LastEditors: Wibus
 * @LastEditTime: 2022-03-19 22:24:41
 * Coding With IU
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const xml2js = require('xml2js');

const rssParser = (data: string) => {
  
  const parser = new xml2js.Parser({
    // trim: true,
    // explicitArray: false,
  });
  const result: any = {
    title: "",
    description: "",
    link: "",
    items: [],
  };
  parser.parseString(data, (err, res) => {
    if (err) {
      return 0;
    }
    // console.log(res.feed.entry)
    for (let index = 0; index < res.feed.entry.length; index++) {
      const entry = res.feed.entry[index];
      result.title = res.feed.title[0]._ ? res.feed.title[0]._ : res.feed.title[0];
      result.link = res.feed.link[0].$.href;
      result.items.push({
        title: entry.title[0]._ ? entry.title[0]._ : entry.title[0],
        link: entry.link[0].$.href,
        pubDate: entry.published[0],
      });
    }
  });
  return result
}

export default rssParser