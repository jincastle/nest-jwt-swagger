import { JwtAuthGuard } from './../auth/jwt/jwt.guard';
import { HttpExceptionFilter } from './../common/exceptions/http-exception.filter';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatRequestDto } from './dto/cats.request.dto';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyCatDto } from './dto/cat.dto';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { CatCurrentDto } from './dto/cat.current.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Cat } from './cats.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '메인페이지' })
  @UseGuards(JwtAuthGuard) //로그인 인증 처리
  @Get()
  getCurrentCat(@CurrentUser() cat) {
    // console.log(cat);
    return cat.readOnlyData;
  }
  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ReadOnlyCatDto, //받을 값을 미리 보여준다.
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: CatRequestDto) {
    return await this.catsService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }

  @ApiOperation({ summary: '업데이트' })
  @UseInterceptors(FileInterceptor('image'))
  @Post('upload')
  uploadCatImg(@UploadedFile() files: Express.Multer.File) {
    console.log(files);
    return 'uploadImg';
  }
}
