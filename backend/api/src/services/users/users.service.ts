import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { Tables } from '~/utils/globals';
import { UserDto, UserMeDto } from '~/models/User';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findOne(_email: string) {
    try {
      const email = _email.toLowerCase();
      const user = await this.knex<UserDto>(Tables.USERS).where({
        email,
      });
      return user[0];
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getByEmail(email: string): Promise<UserMeDto> {
    const user = await this.knex<UserDto>(Tables.USERS)
      .where({ email })
      .first();
    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      token_version: user.token_version,
    };
  }

  async create(user: UserDto) {
    return this.knex<UserDto>(Tables.USERS).insert(user);
  }

  async updateTokenVersion({
    email,
    token_version,
  }: {
    email: string;
    token_version: string;
  }) {
    await this.knex<UserDto>(Tables.USERS)
      .where({ email })
      .update({ token_version });

    return this.knex<UserDto>(Tables.USERS).where({ email }).first();
  }

  async insert(user: UserDto) {
    return this.knex<UserDto>(Tables.USERS).insert(user);
  }
}
