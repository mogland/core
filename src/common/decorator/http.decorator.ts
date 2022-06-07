/*
 * @FilePath: /nx-server/src/common/decorator/http.decorator.ts
 * @author: Wibus
 * @Date: 2022-06-07 07:32:27
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-07 07:32:27
 * Coding With IU
 */
import { SetMetadata, applyDecorators } from '@nestjs/common'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'

// import { HTTP_RES_TRANSFORM_PAGINATE } from '~/constants/meta.constant'
// import * as SYSTEM from '~/constants/system.constant'
// import { FileUploadDto } from '~/shared/dto/file.dto'

export const Paginator: MethodDecorator = (
  target,
  key,
  descriptor: PropertyDescriptor,
) => {
  SetMetadata("__customHttpResTransformPagenate__", true)(descriptor.value)
}

/**
 * @description 跳过响应体处理
 */
export const Bypass: MethodDecorator = (
  target,
  key,
  descriptor: PropertyDescriptor,
) => {
  SetMetadata("__responsePassthrough__", true)(descriptor.value)
}

export declare interface FileDecoratorProps {
  description: string
}


export const HTTPDecorators = {
  Paginator,
  Bypass,
}
