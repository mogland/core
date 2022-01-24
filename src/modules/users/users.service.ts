import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { encryptPassword } from "../../utils/crypt.utils";
import { CreateUserDto } from "../../shared/dto/create-user-dto";
import { User } from "../../shared/entities/users.entity";

@Injectable()
export class UsersService {
  //   private readonly users: User;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findOne(user: string, auth = false) {
    if (auth == true) {
      return await this.userRepository.findOne();
    }else{
      return await this.userRepository.findOne(
        {
          select: ["uuid", "name", "lovename", "description", "email", "avatar", "level", "status", "QQ"],
          where: { name: user },
        }
      );
    }
  }
  async edit(data: CreateUserDto) {
    if (this.userRepository.find({name:data.name})) {
      throw new BadRequestException("此用户名已存在")
    }else if(data.level == null){
      throw new BadRequestException("请输入用户权限")
    }else if(data.status == null){
      throw new BadRequestException("请输入用户状态")
    }else{
      data.password = encryptPassword(data.password, data.uuid)
      return await this.userRepository.update(data.uuid, data)
    }
  }
  async find(query: any) {
    switch (query.type) {
    case "auth":
      return await this.userRepository.find();
    case "all":
      // 过滤password字段
      return await this.userRepository.find({
        select: ["uuid", "name", "lovename", "description", "email", "avatar", "level", "status", "QQ"],
      });
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
        select: ["uuid", "name", "lovename", "description", "email", "avatar", "level", "status", "QQ"],
      });
    case "num":
      return await this.userRepository.count();
    default:
      return await this.userRepository.find({
        select: ["uuid", "name", "lovename", "description", "email", "avatar", "level", "status", "QQ"],
      });
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
      // here is some reason why we need to use save first, then update
      const userData = await this.userRepository.save(data) // we need to save the user before we can get the uuid
      userData.password = encryptPassword(userData.password, userData.uuid) // encrypt the password with the uuid
      return await this.userRepository.update(userData.uuid,userData) // and update the user with the encrypted password
    }
  }
}
