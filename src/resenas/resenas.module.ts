import { Module } from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { ResenasController } from './resenas.controller';
import { Resena } from './entities/resena.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadesModule } from '../actividades/actividades.module';
import { EstudiantesModule } from '../estudiantes/estudiantes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Resena]), ActividadesModule, EstudiantesModule],
  controllers: [ResenasController],
  providers: [ResenasService],
  exports: [ResenasService],
})
export class ResenasModule {}
