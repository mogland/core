/*
 * @FilePath: /nx-core/src/common/decorator/cron-once.decorator.ts
 * @author: Wibus
 * @Date: 2022-07-12 19:07:44
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-12 19:07:44
 * Coding With IU
 */
import cluster from 'cluster'

import { Cron } from '@nestjs/schedule'

import { isMainProcess } from '~/app.config'

export const CronOnce = (...rest: Parameters<typeof Cron>): MethodDecorator => {
  // If not in cluster mode, and PM2 main worker
  if (isMainProcess) {
    return Cron.call(null, ...rest)
  }

  if (cluster.isWorker && cluster.worker?.id === 1) {
    return Cron.call(null, ...rest)
  }

  const returnNothing: MethodDecorator = () => {}
  return returnNothing
}
