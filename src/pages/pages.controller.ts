import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePagesDto } from './create-pages-dto';
import { PagesService } from './pages.service';

@Controller('pages')
@ApiTags("Pages")
export class PagesController {
    constructor(private pagesService: PagesService){}
    @Get('list')
    @ApiOperation({
        summary: "获取全部页面"
    })
    async list(){
        return this.pagesService.list()
    }

    @Get(':path')
    @ApiOperation({
        summary: "获取某个页面"
    })
    async findOne(@Param() params){
        return this.pagesService.findOne(params.path)
    }
    
    @Post('send')
    @ApiOperation({
        summary: "发布页面"
    })
    @UseGuards(AuthGuard('jwt'))
    async send(@Body() data: CreatePagesDto){
        // here is no need to filter XSS here
        // because this is user controller only
        return await this.pagesService.send(data)
    }

    @Get('delete/:path')
    @ApiOperation({
        summary: "删除页面"
    })
    // @UseGuards(AuthGuard('jwt'))
    async del(@Param() params){
        return await this.pagesService.del(params.path)
    }
    // if delete successfully, it will return affected = 1
}
