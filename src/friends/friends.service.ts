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
    check(){
        let links: any
        let status
        const $api = axios.create()
        // $api
        let v = axios.get('https://baidu.com')
        v.then(
            function (res) {
                status = res
            }
            )
        // console.log(status)
        return v.then((res) => {return res.status})
    }
}
