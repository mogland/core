/*
 * @FilePath: /nx-core/src/utils/pic.util.ts
 * @author: Wibus
 * @Date: 2022-07-19 13:56:10
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-19 14:00:30
 * Coding With IU
 */
import getColors from "get-image-colors";
import { Logger } from "@nestjs/common";

export async function getImageColor(buffer: Buffer, type: string) {
  if (!buffer) {
    return undefined;
  }
  try {
    const color = await getColors(buffer, type);
    return color[0].hex();
  } catch (e) {
    Logger.warn(`无法获取图片颜色: ${e.message}`);
    return undefined;
  }
}

function ToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? `0${hex}` : hex;
}

export function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${ToHex(r)}${ToHex(g)}${ToHex(b)}`;
}
