import { Connection } from 'mongoose';
import { hostSchema } from '../schemas/host.schema';

export const hostProviders = [
  {
    provide: 'HOST_MODEL',
    useFactory: (connection: Connection) => connection.model('host', hostSchema),
    // inject: ['DATABASE_CONNECTION'],
  },
];
