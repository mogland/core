import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { join } from 'path';
import { cwd } from '@shared/global/env.global';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { readFileSync } from 'fs';
import { YAML } from 'zx-cjs';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';

interface IEventConfigItem {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  handler: string;
}

interface IEventConfig {
  [key: string]: IEventConfigItem[];
}

@Injectable()
export class AppService {
  private eventConfig: IEventConfig;

  constructor(
    @Inject(ServicesEnum.custom)
    private readonly custom: ClientProxy,
  ) {
    this.getEventConfigFile();
    this.watchConfigFile();
  }

  private getEventConfigFile() {
    const envPath = join(cwd, 'events.yaml');
    let env: string;
    try {
      env = readFileSync(envPath, 'utf-8');
    } catch (error) {
      return '';
    }
    const envObj = YAML.parse(env);
    Object.keys(envObj).forEach((key) => {
      envObj[key] = envObj[key].map(
        (item: { method: string; path: string }) => ({
          ...item,
          method: item.method.toUpperCase(),
          path: item.path.replace(/^\//, ''),
        }),
      );
    });
    this.eventConfig = envObj;
  }

  private watchConfigFile() {
    try {
      fs.watch(join(cwd, 'events.yaml'), (_eventType: any, filename: any) => {
        if (filename) {
          this.getEventConfigFile();
        }
      });
    } catch {
      /* empty */
    }
  }

  private getClient(param: string) {
    const name = param['*'].split('/')[0];
    const client = this.eventConfig[name];
    if (!client) return null;
    return client;
  }

  private validatePathWithMethod(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    param: any,
  ) {
    const client = this.getClient(param);
    if (!client) return null;
    const path = param['*'].split('/').slice(1).join('/');
    const length = path.split('/').length;
    const config =
      client.find((item) => item.path === path) ||
      client.find(
        (item) =>
          item.path.split('/').length === length &&
          item.path
            .split('/')
            .map((item) => item.startsWith('{') && item.endsWith('}')),
      );
    if (!config) return null;
    if (config.method !== method) return null;
    return config;
  }

  private transportData(
    config: IEventConfigItem,
    query: any,
    _param: any,
    body?: any,
  ) {
    const _path = _param['*'].split('/');
    const pathParam = config.path // /user/{id}/info
      .split('/')
      .filter((item: string) => item.startsWith('{') && item.endsWith('}'));
    const param = pathParam.reduce((acc, cur, index) => { // { id: '1' }
      acc[cur.replace(/{|}/g, '')] = _path[index + 2];
      return acc;
    }, {});
    return {
      query,
      param: _param,
      body,
      ...param,
    };
  }

  async transformCustomPath(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    query: any,
    param: any,
    body?: any,
  ) {
    const config = this.validatePathWithMethod(method, param);
    if (!config) throw new NotFoundException();
    const handler = config.handler;
    const data = this.transportData(config, query, param, body);
    return transportReqToMicroservice(this.custom, handler, data);
  }
}
