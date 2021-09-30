/*
 * @FilePath: /nest-server/src/core/services/host.service.ts
 * @author: Wibus
 * @Date: 2021-10-01 05:26:31
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-01 06:10:26
 * Coding With IU
 */
import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Host } from '../schemas/host.schema';
import { CreateCatDto } from '../interface/host.interface';


@Injectable()
export class HostService {
  constructor(
    @Inject('HOST_MODEL')
    private catModel: Model<Host>,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<Host> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Host[]> {
    return this.catModel.find().exec();
  }
}
