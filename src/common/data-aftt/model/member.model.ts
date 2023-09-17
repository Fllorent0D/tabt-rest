import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Member } from '@prisma/client';

@Injectable()
export class DataAFTTMemberModel {
  constructor(
    private readonly prismaService: PrismaService
  ) {
  }

  upsert(member: Member): Promise<Member> {
    if(!member.id) throw new Error('Member ID is required');
    return this.prismaService.member.upsert({
      where: {
        id_licence: {
          id: member.id,
          licence: member.licence
        },
      },
      update: member,
      create: member
    });
  }


}
