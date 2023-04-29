import { HttpStatus } from "@nestjs/common";
import { RpcException } from "~/shared/exceptions/rpc-exception";

export class InternalServerErrorRpcExcption extends RpcException {
    constructor(readonly message: string) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}