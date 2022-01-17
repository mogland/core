/*
 * @FilePath: /GS-server/src/modules/host/host.service.ts
 * @author: Wibus
 * @Date: 2021-10-01 05:26:31
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-17 16:36:38
 * Coding With IU
 */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Host } from "./host.entity";
import { Repository } from "typeorm";
import { CreateHostDto } from "../../shared/dto/create-host-dto";

@Injectable()
export class HostService {
  constructor(
    @InjectRepository(Host)
    private hostRepository: Repository<Host>,
  ) {}

  async find(): Promise<Host> {
    return await this.hostRepository.findOne(1);
  }
  async edit(user: CreateHostDto): Promise<Host> {
    user.id = 1;
    return await this.hostRepository.save(user);
  }
}
