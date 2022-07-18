/*
 * @FilePath: /nx-core/src/modules/markdown/markdown.interface.ts
 * @author: Wibus
 * @Date: 2022-07-18 21:25:36
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-18 21:33:04
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