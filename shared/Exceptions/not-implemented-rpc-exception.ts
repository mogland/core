import { HttpStatus } from "@nestjs/common";
import { RpcException } from "~/shared/Exceptions/rpc-exception";

export class NotImplementedRpcExcption extends RpcException {
    constructor(readonly message: string) {
        super(message, HttpStatus.NOT_IMPLEMENTED);
    }
}