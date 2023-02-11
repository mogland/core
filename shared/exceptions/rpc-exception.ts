import { RpcException as _RpcException } from "@nestjs/microservices";


/**
 * @examples
 * throw new RpcException('Forbidden', HttpStatus.FORBIDDEN);
 */
export class RpcException extends _RpcException {
  constructor(private readonly mes: string, private readonly status: number) {
    super(mes);
  }

  public getError(): object {
    return {
      code: this.status,
      message: this.mes,
    };
  }
}