import { HttpStatus } from "@nestjs/common";
import { RpcException } from "~/shared/exceptions/rpc-exception";

export class ForbiddenRpcExcption extends RpcException {
    constructor(readonly message: string) {
        super(message, HttpStatus.FORBIDDEN);
    }
}