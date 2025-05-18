import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Estudiante } from './estudiantes/entities/estudiante.entity';
import { Actividad } from './actividades/entities/actividad.entity';
import { Resena } from './resenas/entities/resena.entity';

import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { ActividadesModule } from './actividades/actividades.module';
import { ResenasModule } from './resenas/resenas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      entities: [Estudiante, Actividad, Resena],
      dropSchema: true,
      synchronize: true,
    }),
    EstudiantesModule,
    ActividadesModule,
    ResenasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
