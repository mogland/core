/*
 * @FilePath: /mog-core/shared/interface/reaction.interface.ts
 * @author: Wibus
 * @Date: 2022-10-03 17:06:58
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-03 17:13:03
 * Coding With IU
 */

export enum Reactions {
  like = 'like', // ❤️
  thumbUp = 'thumbUp', // 👍
  thumbDown = 'thumbDown', // 👎
  smile = 'smile', // 😄
  angry = 'angry', // 😡
  confused = 'confused', // 😕
  laugh = 'laugh', // 😆
  hooray = 'hooray', // 🎉
  rocket = 'rocket', // 🚀
  eyes = 'eyes', // 👀
  star = 'star', // ⭐
}

export interface IReaction {
  [key: string]: number;
}
