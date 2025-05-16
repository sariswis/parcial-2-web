import { Module } from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { ResenasController } from './resenas.controller';

@Module({
  controllers: [ResenasController],
  providers: [ResenasService],
})
export class ResenasModule {}
