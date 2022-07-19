/*
 * @FilePath: /nx-core/src/modules/markdown/markdown.interface.ts
 * @author: Wibus
 * @Date: 2022-07-18 21:25:36
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-19 11:37:07
 * Coding With IU
 */

export type MarkdownMetaType = {
  title: string;
  slug: string;
  created?: Date | null | undefined;
  modified?: Date | null | undefined;
} & Record<string, any>; // 其他字段

export interface MarkdownYAMLProps {
  meta: MarkdownMetaType;
  text: string;
}

export const ArticleType = Object.freeze({
  Post: 'post',
  Note: 'note',
  Page: 'page',
} as const)

export enum ArticleTypeEnum {
  Post = 'post',
  Note = 'note',
  Page = 'page',
}
