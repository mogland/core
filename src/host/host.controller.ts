import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { HostService } from './host.service';
import { CreateHostDto } from './create-host-dto';

@Controller('host')
@ApiTags('Host')
// @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard('jwt'))
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
                "ok": 0,
                "message": error
            }
        }
    }
}
