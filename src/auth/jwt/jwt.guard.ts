import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//리퀘스트로 들어온 유저가 실제 DB에 있는 유저인지 체크
//실제 유저가 맞으면 jwtService.sign()에 의해 유저 정보가 jwt로 변환
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
