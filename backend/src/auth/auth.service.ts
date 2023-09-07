import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt/dist';
import { signUpDto } from 'src/dto/signup.dto';
import { loginDto } from 'src/dto/login.dto';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateToken(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token);

      if (!decoded) return false;
      // console.log(decoded);
      // Token is valid
      return true;
    } catch (error) {
      // Token is invalid or expired
      return false;
    }
  }

  async getUsers(): Promise<{ users?: User[]; message?: string }> {
    const users = await this.UserModel.find({ role: { $ne: 'admin' } });

    if (!users) {
      return { message: 'No users Found' };
    }

    return {
      users,
      message: 'users fetched',
    };
  }
  async getLoggedInUser(
    id: string,
  ): Promise<{ user?: User; message?: string }> {
    const user = await this.UserModel.findById(id);

    if (!user) {
      return { message: 'No user Found' };
    }

    return {
      user,
      message: 'user fetched',
    };
  }

  async signUp(
    dto: signUpDto,
  ): Promise<{ user: User; success: boolean; message: string }> {
    const { username, email, password } = dto;

    const userFound = await this.UserModel.findOne({ email });
    if (userFound) {
      throw new ConflictException(`User with email ${email} already exists.`);
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await this.UserModel.create({
      username,
      email,
      password: hashedPass,
    });

    return { user, success: true, message: 'Account Created Successfully' };
  }
  async updateUser(
    filePath: string,
    user: User,
  ): Promise<{ user?: User; success: boolean; message: string }> {
    const userFound = await this.UserModel.findOne({ _id: user._id });

    if (!userFound) {
      return { success: false, message: 'No User Found' };
    }

    userFound.profilePicture = filePath;
    await userFound.save();

    return {
      user: userFound,
      success: true,
      message: 'Profile Picture Updated',
    };
  }

  async login(
    dto: loginDto,
    rememberMe: string,
  ): Promise<{
    token?: string;
    user?: {};
    success?: boolean;
    message?: string;
  }> {
    const { email, password } = dto;
    const user = await this.UserModel.findOne({ email });

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
      // throw new UnauthorizedException('Invalid Email or password');
    }

    if (user.status === 'blocked') {
      return { success: false, message: 'You are blocked by the Admin' };
    }

    const isPassOk = await bcrypt.compare(password, user.password);

    if (!isPassOk) {
      return { success: false, message: 'Invalid email or password' };
      // throw new UnauthorizedException('Invalid Email or password');
    }
    // console.log(rememberMe);

    const expiresIn = rememberMe === 'true' ? '3d' : '1d';

    const token = this.jwtService.sign(
      {
        id: user._id,
        // role: user.role
      },
      { expiresIn },
    );
    // console.log(user);
    return {
      token,
      user: {
        //  role: user.role,
        username: user.username,
        email: user.email,
        userId: user._id,
        status: user.status,
      },
      success: true,
      message: 'Login Success',
    };
  }

  async blockUser(id: string): Promise<{ success: boolean; message: string }> {
    const user = await this.UserModel.findById(id);

    if (!user) {
      return {
        success: false,
        message: 'User Not Found',
      };
    }
    user.status = 'blocked';
    await user.save();

    return {
      success: true,
      message: `${user.username} has been blocked`,
    };
  }
  async unblockUser(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.UserModel.findById(id);

    if (!user) {
      return {
        success: false,
        message: 'User Not Found',
      };
    }
    user.status = 'unblocked';
    await user.save();

    return {
      success: true,
      message: `${user.username} has been unblocked`,
    };
  }
}
