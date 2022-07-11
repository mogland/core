/*
 * @FilePath: /nx-core/src/utils/rss-parser/rss-parser.fields.ts
 * @author: Wibus
 * @Date: 2022-07-11 16:41:46
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-11 17:30:00
 * Coding With IU
 */

export const fields: any = {};

fields.feed = [
  ['author', 'creator'],
  ['dc:publisher', 'publisher'],
  ['dc:creator', 'creator'],
  ['dc:source', 'source'],
  ['dc:title', 'title'],
  ['dc:type', 'type'],
  'title',
  'description',
  'author',
  'pubDate',
  'webMaster',
  'managingEditor',
  'generator',
  'link',
  'language',
  'copyright',
  'lastBuildDate',
  'docs',
  'generator',
  'ttl',
  'rating',
  'skipHours',
  'skipDays',
];

fields.item = [
  ['author', 'creator'],
  ['dc:creator', 'creator'],
  ['dc:date', 'date'],
  ['dc:language', 'language'],
  ['dc:rights', 'rights'],
  ['dc:source', 'source'],
  ['dc:title', 'title'],
  'title',
  'link',
  'pubDate',
  'author',
  'summary',
  ['content:encoded', 'content:encoded', {includeSnippet: true}],
  'enclosure',
  'dc:creator',
  'dc:date',
  'comments',
];

const mapItunesField = function(f: any) {
  return [`itunes:${f}`, f];
}

fields.podcastFeed = ([
  'author',
  'subtitle',
  'summary',
  'explicit'
]).map(mapItunesField);

fields.podcastItem = ([
  'author',
  'subtitle',
  'summary',
  'explicit',
  'duration',
  'image',
  'episode',
  'image',
  'season',
  'keywords',
  'episodeType'
]).map(mapItunesField);


// eslint-disable-next-line import/no-default-export
export default fields;