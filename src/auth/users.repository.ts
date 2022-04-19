import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bycrypt from "bcrypt";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(userName: string, password: string): Promise<void> {

    const salt = await bycrypt.genSalt();
    const hashedPassword = await bycrypt.hash(password, salt);
    const user = this.create({ userName, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (Number(error.code) === 23505) {
        throw new ConflictException("User already exists");
      } else {
        throw new InternalServerErrorException("");
      }
    }
  }
}
