import { Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { Actividad } from './entities/actividad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudiantesModule } from '../estudiantes/estudiantes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad]), EstudiantesModule],
  controllers: [ActividadesController],
  providers: [ActividadesService],
  exports: [ActividadesService],
})
export class ActividadesModule {}
