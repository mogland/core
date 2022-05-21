/*
 * @FilePath: /ns-server/src/modules/engine/props.interface.ts
 * @author: Wibus
 * @Date: 2022-05-21 19:01:59
 * @LastEditors: Wibus
 * @LastEditTime: 2022-05-21 19:23:13
 * Coding With IU
 */

import { Configs } from "shared/entities/configs.entity";

export interface eneineProps {
    configs: Configs[];
    posts: any,
    pages: any,
    categories: any,
    friends: any,
    projects: any,
    comments: any,
}