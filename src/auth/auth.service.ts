import { CatsRepository } from './../cats/cats.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly catsRepository: CatsRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogIn(data: LoginRequestDto) {
    const { email, password } = data;

    //해당하는 이메일이 있는지
    const cat = await this.catsRepository.findCatByEmail(email);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!cat) {
      throw new UnauthorizedException('이메일을 확인해 주세요');
    }

    //패스워드 확인
    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      cat.password,
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!isPasswordValidated) {
      throw new UnauthorizedException('비밀번호를 확인해 주세요');
    }

    const payload = { email: email, sub: cat.id };
    return {
      token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
      }),
    };
  }
}
