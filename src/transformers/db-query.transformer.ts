/*
 * @FilePath: /nx-core/src/transformers/db-query.transformer.ts
 * @author: Wibus
 * @Date: 2022-06-21 23:55:26
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-21 23:55:27
 * Coding With IU
 */

export const addYearCondition = (year?: number) => {
  if (!year) {
    return {}
  }
  return {
    created: {
      $gte: new Date(year, 1, 1),
      $lte: new Date(year + 1, 1, 1),
    },
  }
}
