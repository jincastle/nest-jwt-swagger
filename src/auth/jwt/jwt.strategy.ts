import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';
import { CatsRepository } from 'src/cats/cats.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly catsRepository: CatsRepository) {
    //인증 하는 부분
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //header의 토큰으로부터 추출
      secretOrKey: process.env.JWT_SECRET_KEY, //시크릿키
      ignoreExpiration: false, //jwt 만료기간
    });
  }

  //authguard를 주입 후 validate가 실행됨
  //디코딩된 payload를 받는다.
  async validate(payload: Payload) {
    const cat = await this.catsRepository.findCatByIdWithoutPassword(
      payload.sub, //id
    );

    //비밀번호를 제외한 cat 정보
    if (cat) {
      return cat; // request.user
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}
