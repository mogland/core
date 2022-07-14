/*
 * @FilePath: /nx-core/src/modules/aggregate/aggregate.interface.ts
 * @author: Wibus
 * @Date: 2022-07-10 16:02:59
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-10 16:03:00
 * Coding With IU
 */
export interface RSSProps {
  title: string;
  url: string;
  author: string;
  data: {
    created: Date | null;
    modified: Date | null;
    link: string;
    title: string;
    text: string;
    id: string;
  }[];
}
