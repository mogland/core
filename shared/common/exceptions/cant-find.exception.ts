/*
 * @FilePath: /nx-core/shared/common/exceptions/cant-find.exception.ts
 * @author: Wibus
 * @Date: 2022-06-08 21:00:25
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-09 21:36:50
 * Coding With IU
 */
import { sample } from 'lodash';

import { NotFoundException } from '@nestjs/common';

export const NotFoundMessage = [
  'www内容不知道去哪里了',
  '哎呀，遇到了一点小问题',
  '外星人偷走了我的内容',
  '可能是程序出了问题',
];

export class CannotFindException extends NotFoundException {
  constructor() {
    super(sample(NotFoundMessage));
  }
}
