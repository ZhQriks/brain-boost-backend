import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/persistence/prisma/prisma.service';

@Module({
  providers: [UserService, PrismaService],
})
export class UserModule {}
