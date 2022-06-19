export enum ErrorCodeEnum {
  PostNotFoundError = 10000,
  SlugNotAvailable = 'slug_not_available',
  MasterLostError = 20000,
}

export const ErrorCode = Object.freeze<Record<ErrorCodeEnum, [string, number]>>({
  [ErrorCodeEnum.SlugNotAvailable]: ['slug 不可用', 400],
  [ErrorCodeEnum.PostNotFoundError]: ['文章不存在', 404],
  [ErrorCodeEnum.MasterLostError]: ['主人不存在', 500],
})
