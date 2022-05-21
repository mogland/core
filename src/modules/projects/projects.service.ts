import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProjectsDto } from "shared/dto/create-projects-dto";
import { Projects } from "shared/entities/projects.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects)
    private projectsRepository: Repository<Projects>,
  ) {}

  async list(){
    return await this.projectsRepository.find();
  }
  async all(){
    return await this.projectsRepository.find();
  }
  async getProject(id: number){
    return await this.projectsRepository.findOne(id);
  }
  async createProject(project: CreateProjectsDto){
    return await this.projectsRepository.save(project);
  }
  async updateProject(project: CreateProjectsDto){
    return await this.projectsRepository.update(project.pid, project);
  }

}