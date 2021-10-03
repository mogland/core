import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import objAdd from 'function/ObjectDefine';
import { HostService } from 'host/host.service';
import { CreateHostDto } from './create-host-dto';

@Controller('host')
@ApiTags('host')
export class HostController {
    constructor(private hostService: HostService){}
    @Get()
    @ApiOperation({
        summary: '获取主人信息'
    })
    async list(){
        return await this.hostService.find();
    }
    @Post()
    @ApiOperation({
        summary: '修改主人信息'
    })
    @ApiCreatedResponse({
        description: `{
            "ok": 1
        }`,
        type: CreateHostDto
      })
    async add(@Body() user: CreateHostDto){
        try {
            await this.hostService.edit(user)
            return {
                "ok": 1
            }
        } catch (error) {
            return {
                "ok": 0
            }
        }
    }
}
