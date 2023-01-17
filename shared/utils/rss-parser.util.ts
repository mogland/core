import { BadRequestException } from '@nestjs/common';
import xml2js from 'xml2js';

class RssResult {
  title: string;
  link?: string;
  items: RssItem[];
}

class RssItem {
  title: string; // 标题
  link: string; // 链接
  publishedDate?: string; // 发布日期
}

enum RssParserType {
  RSS = 'rss',
  ATOM = 'atom',
}

const parser = new xml2js.Parser();

const atomParser = (
  xml: string,
  callback: (result: RssResult) => void,
): void => {
  parser.parseString(xml, (err, result) => {
    if (err) {
      throw new BadRequestException(err.message);
    }

    const rssResult = new RssResult();
    rssResult.title =
      result.feed.title[0]._ !== undefined
        ? result.feed.title[0]._
        : result.feed.title[0];
    // console.log("网站标题解析成功")
    rssResult.link = result.feed.$['xml:base'];
    // console.log("网站链接解析成功")

    rssResult.items = result.feed.entry.map((item) => {
      const rssItem = new RssItem();
      rssItem.title =
        item.title[0]._ !== undefined ? item.title[0]._ : item.title[0];
      // console.log("文章标题解析成功")
      rssItem.link =
        item.link[0].$.href !== undefined ? item.link[0].$.href : '';
      // console.log("文章链接解析成功")
      rssItem.publishedDate =
        item.published[0] !== undefined ? item.published[0] : '';
      // console.log("文章发布日期解析成功")
      return rssItem;
    });
    callback(rssResult);
  });
};
const rssParser = (
  xml: string,
  callback: (result: RssResult) => void, // 回调函数
): void => {
  parser.parseString(xml, (err, result) => {
    if (err) {
      throw new BadRequestException(err.message);
    }
    const rssResult = new RssResult();
    rssResult.title =
      result.rss.channel[0].title[0]._ !== undefined
        ? result.rss.channel[0].title[0]._
        : result.rss.channel[0].title[0];
    // console.log("网站标题解析成功")
    rssResult.link =
      result.rss.channel[0].link[0]._ !== undefined
        ? result.rss.channel[0].link[0]._
        : result.rss.channel[0].link[0];
    // console.log("网站链接解析成功")
    rssResult.items = result.rss.channel[0].item.map((item) => {
      const rssItem = new RssItem();
      rssItem.title =
        item.title[0]._ !== undefined ? item.title[0]._ : item.title[0];
      // console.log("文章标题解析成功")
      rssItem.link =
        item.link[0]._ !== undefined ? item.link[0]._ : item.link[0];
      // console.log("文章链接解析成功")
      rssItem.publishedDate =
        item.pubDate[0] !== undefined ? item.pubDate[0] : '';
      // console.log("文章发布日期解析成功")
      return rssItem;
    });
    callback(rssResult);
  });
};

const FeedParser = (xml: string, type: RssParserType = RssParserType.RSS) => {
  let res: RssResult;
  if (type === RssParserType.RSS) {
    rssParser(xml, (result) => {
      res = result;
    });
  } else if (type === RssParserType.ATOM) {
    atomParser(xml, (result) => {
      res = result;
    });
  }
  // stringify
  return JSON.stringify(res!);
};

export { FeedParser, RssParserType };
