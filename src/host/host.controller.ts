import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('host')
export class HostController {

    @Get('admin')
    @HttpCode(200)
    async find(){
        // connect to database (TODO)
        let data = {}
        Object.defineProperty(data, "name", {
            value: "Wibus",
            writable: false,
        })
        Object.defineProperty(data, "description", {
            value: "Just Uaeua",
            writable: false,
        })
        Object.defineProperty(data, "image", {
            value: "http://q1.qlogo.cn/g?b=qq&nk=1596355173&s=640",
            writable: false,
        })
        Object.defineProperty(data, "github", {
            value: "wibus-wee",
            writable: false,
        })
        return data;
    }
}
