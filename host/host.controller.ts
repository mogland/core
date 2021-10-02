import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import objAdd from 'function/ObjectDefine';
import { HostService } from 'host/host.service';

@Controller('host')
@ApiTags('host')
export class HostController {
    constructor(private hostService: HostService){}
    @Get('admin')
    @ApiOperation({
        summary: '获取主人信息'
    })
    @HttpCode(200)
    find(){
        // connect to database (TODO)
        let data = {}
        let name : string, description : string, image : string, github : string
        name = "Wibus"
        description = "Just Uaeua"
        image = "http://q1.qlogo.cn/g?b=qq&nk=1596355173&s=640"
        github = "wibus-wee"

        objAdd(data, "name", name)
        objAdd(data, "description", description)
        objAdd(data, "image", image)
        objAdd(data, "github", github)

        return data;
    }
    @Get()
    async list(){
        // return await this.hostService.findAll();
    }
}
