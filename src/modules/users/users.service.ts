import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./create-user-dto";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  //   private readonly users: User;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findOne(user: string): Promise<User[] | undefined> {
    return await this.userRepository.find({ name: user });
  }
  async edit(user: CreateUserDto): Promise<User | undefined> {
    return await this.userRepository.save(user);
  }
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
  async create(user: CreateUserDto): Promise<User> {
    return await this.userRepository.save(user);
  }
}
