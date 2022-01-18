import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "../../shared/dto/create-user-dto";
import { User } from "./users.entity";

@Injectable()
export class UsersService {
  //   private readonly users: User;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findOne(user: string) {
    return await this.userRepository.find({ name: user });
  }
  async edit(data: CreateUserDto) {
    if (this.userRepository.find({name:data.name})) {
      throw new BadRequestException("此用户名已存在")
    }else if(data.level == null){
      throw new BadRequestException("请输入用户权限")
    }else if(data.status == null){
      throw new BadRequestException("请输入用户状态")
    }else{
      return await this.userRepository.save(data)
    }
  }
  async find(query: any) {
    switch (query.type) {
    case "all":
      return await this.userRepository.find();
    case "limit":
      let page = query.page
      if (page < 1 || isNaN(page)) {
        page = 1;
      }
      const limit = 10;
      const skip = (page - 1) * limit;
      return await this.userRepository.find({
        skip: skip,
        take: limit,
      });
    case "num":
      return await this.userRepository.count();
    default:
      return await this.userRepository.find();
    }
  }
  async create(data: CreateUserDto){
    const name = this.userRepository.findOne({name:data.name})[0]
    if (name) {
      throw new BadRequestException("此用户名已存在")
    }else if(data.level == null){
      throw new BadRequestException("请输入用户权限")
    }else if(data.status == null){
      throw new BadRequestException("请输入用户状态")
    }else{
      return await this.userRepository.save(data)
    }
  }
}
