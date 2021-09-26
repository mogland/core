import { Injectable } from '@nestjs/common';
import delXss from 'src/core/function/xss';
import { CreateLinks } from 'src/core/interface/friends.interface';
import axios from 'axios'
import objAdd from 'src/core/function/ObjectDefine';

@Injectable()
export class FriendsService {
    create(data: CreateLinks){
        // create data to database (todo)
        data.name = delXss(data.name)
        data.website = delXss(data.website)
        if (data.desc != null) {
            data.desc = delXss(data.desc)    
        }
        if (data.image != null) {
            data.image = delXss(data.image)
        }
        if (data.check != null) {
            data.check = 0
        }
        return data
        // return 1
    }
    async check(){
        let links: any
        let status
        const $api = axios.create()
        // $api
        axios
            .get('https://baidu.com')
            .then((response) => {
                status = response.status;
                // console.log(response.status)
                // console.log(status)
                // console.log("get")
                return status
            })
        // console.log(status)
        return await status
    }
}
