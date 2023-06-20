import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateUserRequestDto, CreateUserResponseDto, LoginUserRequestDto } from '../user/user.dto';
import { AuthService } from './auth.service';
import { LoginUserResponseDto } from '../user/user.dto';
@Controller('auth')
@ApiTags('Authentication & Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @Post('signup')
  @ApiBody({
    type: () => CreateUserRequestDto,
    description: 'User signup data',
    required: true,
    schema: {
      example: {
        email: 'example@example.com',
        username: 'example',
        phone: '+123456789',
        password: 'V3ry_strong_P@ssword',
      },
    },
  })
  async signUpUser(
    @Body() userData: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    try {
      const userExists = await this.authService.checkIfUserExists(
        userData.email,
      );
      if (userExists) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const newUser = await this.authService.signUp(userData);
      this.logger.log(`User signed up: ${newUser.email}`);

      return newUser;
    } catch (error: any) {
      this.logger.error(`Error signing up user: ${error.message}`);
      console.log(error);
      throw error;
    }
  }

  @Post('signin')
  @ApiBody({
    type: () => LoginUserRequestDto,
    description: 'User signin data',
    required: true,
    schema: {
      example: {
        email: 'example@example.com',
        password: 'V3ry_strong_P@ssword',
      },
    },
  })
  async signInUser(
    @Body() userData: LoginUserRequestDto,
  ): Promise<LoginUserResponseDto> {
    try {
      const userExists = await this.authService.checkIfUserExists(
        userData.email,
      );
      if (!userExists) {
        throw new HttpException('This user is not found', HttpStatus.NOT_FOUND);
      }

      const accessToken = await this.authService.signIn(userData);
      this.logger.log(`User logged in: ${userData.email}`);
      return accessToken;
    } catch (error: any) {
      this.logger.error(`Error logging up user: ${error.message}`);
      console.log(error);
      throw error;
    }
  }
}
