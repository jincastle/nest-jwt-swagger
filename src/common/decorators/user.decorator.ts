import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CatCurrentDto } from 'src/cats/dto/cat.current.dto';

//req.user를 커스텀한다는 느낌 인터페이스 제공
//    //데코레이터 커스텀(CurrentUser)
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.user as CatCurrentDto;
  },
);
