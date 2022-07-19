/*
 * @FilePath: /nx-core/src/processors/helper/helper.thumbs.service.ts
 * @author: Innei
 * @Date: 2022-07-19 13:18:12
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-19 13:19:37
 * Coding With IU
 */


import { DbService } from '@app/db'
import { Injectable, Logger } from '@nestjs/common'

import { RedisKeys } from '~/constants/cache.constant'
import { ArticleType } from '~/modules/markdown/markdown.interface'
import { PostModel } from '~/modules/post/post.model'
import { InjectModel } from '~/transformers/model.transformer'
import { getRedisKey } from '~/utils/redis.util'
import { CacheService } from '../cache/cache.service'

@Injectable()
export class ThumbsService {
  private logger: Logger
  constructor(
    @InjectModel(PostModel)
    private readonly postModel: MongooseModel<PostModel>,
    private readonly redis: CacheService,
    private readonly databaseService: DbService,
  ) {
    this.logger = new Logger(ThumbsService.name)
  }

  private checkIdAndIp(id: string, ip: string) {
    if (!ip) {
      this.logger.debug('无法更新阅读计数, IP 无效')
      return false
    }
    if (!id) {
      this.logger.debug('无法更新阅读计数, ID 不存在')
      return false
    }
    return true
  }

  public async updateReadCount(
    type: keyof typeof ArticleType,
    id: string,
    ip: string,
  ) {
    if (!this.checkIdAndIp(id, ip)) {
      return
    }

    const model = this.databaseService.getModelByRefType(type as any)
    const doc = await model.findById(id)

    if (!doc) {
      this.logger.debug('无法更新阅读计数, 文档不存在')
      return
    }

    const redis = this.redis.getClient()

    const isReadBefore = await redis.sismember(
      getRedisKey(RedisKeys.Read, id),
      ip,
    )
    if (isReadBefore) {
      this.logger.debug(`已经增加过计数了, ${id}`)
      return
    }
    await Promise.all([
      redis.sadd(getRedisKey(RedisKeys.Read, doc._id), ip),
      doc.updateOne({ $inc: { 'count.read': 1 } }),
    ])
    this.logger.debug(`增加阅读计数, (${doc.title}`)
  }

  public async updateLikeCount(
    type: keyof typeof ArticleType,
    id: string,
    ip: string,
  ): Promise<boolean> {
    if (!this.checkIdAndIp(id, ip)) {
      throw '无法获取到 IP'
    }

    const model = this.databaseService.getModelByRefType(type as any)
    const doc = await model.findById(id)

    if (!doc) {
      throw '无法更新喜欢计数, 文档不存在'
    }

    const redis = this.redis.getClient()

    const isLikeBefore = await redis.sismember(
      getRedisKey(RedisKeys.Like, id),
      ip,
    )
    if (isLikeBefore) {
      this.logger.debug(`已经增加过计数了, ${id}`)
      return false
    }
    await Promise.all([
      redis.sadd(getRedisKey(RedisKeys.Like, doc._id), ip),
      doc.updateOne({ $inc: { 'count.like': 1 } }),
    ])
    this.logger.debug(`增加喜欢计数, (${doc.title}`)
    return true
  }
}
