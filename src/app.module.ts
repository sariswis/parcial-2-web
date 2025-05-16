import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Usuario } from './usuarios/entities/usuario.entity';
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
      host: process.env.DB_HOST ?? 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'parcial2',
      entities: [Estudiante, Actividad, Resena],
      synchronize: true,
      dropSchema: true,
    }),
    EstudiantesModule,
    ActividadesModule,
    ResenasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
