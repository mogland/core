export enum ErrorCodeEnum {
  PostNotFoundError = 10000,
  SlugNotAvailable = 'slug_not_available',
  MasterLostError = 20000,
}

export const ErrorCode = Object.freeze<Record<ErrorCodeEnum, [string, number]>>(
  {
    [ErrorCodeEnum.SlugNotAvailable]: ['slug 不可用', 400],
    [ErrorCodeEnum.PostNotFoundError]: ['文章不存在', 404],
    [ErrorCodeEnum.MasterLostError]: ['主人不存在', 500],
  },
);

export enum RequestStatusEnum {
  Success = 200,
  Created = 201,
  BadRequest = 400,
  BadGateway = 502,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}
