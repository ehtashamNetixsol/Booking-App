import {
  Controller,
  Body,
  Post,
  Patch,
  Req,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Headers,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from 'src/dto/signup.dto';
import { loginDto } from 'src/dto/login.dto';
import { User } from 'src/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/middlewares/jwt.admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/checkToken')
  async checkToken(@Headers('authorization') authorization: string) {
    try {
      if (!authorization) {
        throw new HttpException('Token not provided', HttpStatus.UNAUTHORIZED);
      }

      const token = authorization.replace('Bearer ', '');
      // console.log(token);

      // Call a method from your authService to validate the token
      const isValid = await this.authService.validateToken(token);

      if (isValid) {
        return { success: true, message: 'Token is valid' };
      } else {
        throw new HttpException('Token is invalid', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      throw new HttpException(
        'Token validation failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('users')
  async getUsers(): Promise<{ users?: User[]; message?: string }> {
    return this.authService.getUsers();
  }

  @Get('profile')
  @UseGuards(AuthGuard())
  async getProfile(@Req() req) {
    return this.authService.getLoggedInUser(req.user._id);
  }

  @Post('blockUser/:id')
  @UseGuards(AuthGuard(), AdminGuard)
  async blockUser(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    // console.log(id);
    return this.authService.blockUser(id);
  }
  @Post('unblockUser/:id')
  @UseGuards(AuthGuard(), AdminGuard)
  async unblockUser(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    // console.log(id);
    return this.authService.unblockUser(id);
  }

  @Post('/signup')
  async signup(@Body() dto: signUpDto): Promise<{ user: User }> {
    try {
      const user = await this.authService.signUp(dto);
      return user;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('/login/:rememberMe')
  async login(
    @Body() dto: loginDto,
    @Param('rememberMe') rememberMe: string,
  ): Promise<{ token?: string; msg?: string }> {
    return await this.authService.login(dto, rememberMe);
  }

  @Patch('updateProfilePicture')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('profilePicture', multerConfig))
  async updateProfilePicture(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ user?: User; success: boolean; message: string }> {
    // console.log('hello');
    if (file) {
      const user = req.user;
      const filePath = file.path.normalize();
      console.log(filePath);

      return this.authService.updateUser(filePath, user);
    }
  }
}
