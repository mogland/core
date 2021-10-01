import { Controller, Get, HttpCode } from '@nestjs/common';
import objAdd from 'core/function/ObjectDefine';
import { HostService } from 'core/services/host.service';

@Controller('host')
export class HostController {
    constructor(private hostService: HostService){}
    @Get('admin')
    @HttpCode(200)
    async find(){
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
}
