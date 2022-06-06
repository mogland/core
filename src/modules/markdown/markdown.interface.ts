/*
 * @FilePath: /nx-server/src/modules/markdown/markdown.interface.ts
 * @author: Wibus
 * @Date: 2022-06-04 16:55:16
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-06 22:09:30
 * Coding With IU
 */
export type MetaType = {
  createdAt?: Date | null | undefined
  updatedAt?: Date | null | undefined
  title: string
  path: string
} & Record<string, any>

export interface MarkdownYAMLProperty {
  meta: MetaType
  content: string
}
