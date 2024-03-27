import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma-service/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(input: Prisma.UserCreateInput) {
    try {
      const user = await this.prismaService.user.create({
        data: input,
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async getAllUsers() {
    try {
      const allUsers = await this.prismaService.user.findMany();
      return allUsers;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(body: Prisma.UserUpdateInput, id: number) {
    try {
      const foundUser = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (!foundUser) {
        throw new NotFoundException('user not found');
      }

      const updatedUser = await this.prismaService.user.update({
        data: body,
        where: {
          id,
        },
      });
      return updatedUser;
    } catch (error) {
      console.log(error);
      if (error.status === 404) {
        throw new NotFoundException(error.response.message);
      }
      throw new BadRequestException(error.response.message);
    }
  }

  async delete(id: number) {
    try {
      const foundUser = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (!foundUser) {
        throw new NotFoundException('user not found');
      }
      await this.prismaService.user.delete({
        where: {
          id,
        },
      });
      return { message: `user id : ${id} has been deleted` };
    } catch (error) {
      console.log(error);
      if (error.status === 404) {
        throw new NotFoundException(error.response.message);
      }
      throw new BadRequestException(error.response.message);
    }
  }
}
