/*
 * @FilePath: /nx-server/src/modules/markdown/markdown.interface.ts
 * @author: Wibus
 * @Date: 2022-06-04 16:55:16
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-04 16:55:16
 * Coding With IU
 */
export type MetaType = {
  created?: Date | null | undefined
  modified?: Date | null | undefined
  title: string
  slug: string
} & Record<string, any>

export interface MarkdownYAMLProperty {
  meta: MetaType
  text: string
}
