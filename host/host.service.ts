/*
 * @FilePath: /Nest-server/host/host.service.ts
 * @author: Wibus
 * @Date: 2021-10-01 05:26:31
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-02 14:56:37
 * Coding With IU
 */
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Host } from './host.entity';
import { Repository } from 'typeorm'


@Injectable()
export class HostService {
    constructor(
        @InjectRepository(Host)
        private hostRepository: Repository<Host>,
    ){}
    async findAll(): Promise<Host[]> {
        return await this.hostRepository.find();
    }
}
