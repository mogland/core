/*
 * @FilePath: /GS-server/src/modules/projects/projects.controller.ts
 * @author: Wibus
 * @Date: 2022-02-27 11:35:10
 * @LastEditors: Wibus
 * @LastEditTime: 2022-02-27 11:42:49
 * Coding With IU
 */

import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateProjectsDto } from "shared/dto/create-projects-dto";
import { ProjectsService } from "./projects.service";

@Controller("projects")
@ApiTags("Projects")
export class ProjectsController {

  constructor(
      private projectsService: ProjectsService,
  ) {}

  @Get()
  async listProjects() {
    return await this.projectsService.listProjects();
  }
  @Get("/:id")
  async getProject(id: number) {
    return await this.projectsService.getProject(id);
  }
  @Post("/create")
  async createProject(@Body() project: CreateProjectsDto) {
    return await this.projectsService.createProject(project);
  }
    

}