import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { InjectRepository } from "@nestjs/typeorm";
import * as bycrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UsersRepository) private usersRepo: UsersRepository,
              private jwtService: JwtService) {
  }

  async signUp(userName: string, password: string): Promise<void> {
    return this.usersRepo.createUser(userName, password);
  }

  async signIn(userName: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.usersRepo.findOne({ userName });
    if (user && (await bycrypt.compare(password, user.password))) {
      const payload: JwtPayload = { userName };
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException("Wrong credentials");
    }
  }
}
