/**
 * @copy https://github.com/surmon-china/nodepress/blob/main/src/processors/database/database.provider.ts
 */
import mongoose from 'mongoose';
import { DB_CONNECTION_TOKEN } from '~/shared/constants/system.constant';
import { chalk } from 'zx-cjs';
import { MONGO_DB } from '@core/app.config';
import { consola } from '~/shared/global/consola.global';

mongoose.set('strictQuery', true);

export const databaseProvider = {
  provide: DB_CONNECTION_TOKEN,
  useFactory: async () => {
    let reconnectionTask: NodeJS.Timeout | null = null;
    const RECONNECT_INTERVAL = 6000;

    const connection = () => {
      return mongoose.connect(MONGO_DB.uri, {});
    };
    const Badge = `[${chalk.yellow('MongoDB')}]`;

    const color = (str: TemplateStringsArray) => {
      return str.map((s) => chalk.green(s)).join('');
    };
    mongoose.connection.on('connecting', () => {
      consola.info(Badge, color`connecting...`);
    });

    mongoose.connection.on('open', () => {
      consola.info(Badge, color`readied!`);
      if (reconnectionTask) {
        clearTimeout(reconnectionTask);
        reconnectionTask = null;
      }
    });

    mongoose.connection.on('disconnected', () => {
      consola.error(
        Badge,
        chalk.red(
          `disconnected! retry when after ${RECONNECT_INTERVAL / 1000}s`,
        ),
      );
      reconnectionTask = setTimeout(connection, RECONNECT_INTERVAL);
    });

    mongoose.connection.on('error', (error) => {
      consola.error(Badge, 'error!', error);
      mongoose.disconnect();
    });

    return await connection().then((mongoose) => mongoose.connection);
  },
};
