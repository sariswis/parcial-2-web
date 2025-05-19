import { Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { Actividad } from './entities/actividad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad])],
  controllers: [ActividadesController],
  providers: [ActividadesService],
  exports: [ActividadesService],
})
export class ActividadesModule {}
