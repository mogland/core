import { ConfigsInterface } from './config.interface';

export const DefaultConfigs: () => ConfigsInterface = () => ({
  seo: {
    title: 'Mog',
    description: 'A Next generation blog system',
    keyword: ['blog', 'mog'],
  },
  site: {
    frontUrl: 'http://localhost:2330',
    serverUrl: 'http://localhost:2000',
  },
  webhooks: [],
  email: {
    host: '',
    user: '',
    pass: '',
    port: '465',
    secure: true,
  },
  themes: [],
  schedule: [],
});
