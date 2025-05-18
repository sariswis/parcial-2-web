import { Module } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { EstudiantesController } from './estudiantes.controller';
import { Estudiante } from './entities/estudiante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadesModule } from '../actividades/actividades.module';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante]), ActividadesModule],
  controllers: [EstudiantesController],
  providers: [EstudiantesService],
  exports: [EstudiantesService],
})
export class EstudiantesModule {}
