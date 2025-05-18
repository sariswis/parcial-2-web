import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from '../../actividades/entities/actividad.entity';
import { Estudiante } from '../../estudiantes/entities/estudiante.entity';
import { Resena } from '../../resenas/entities/resena.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [Estudiante, Actividad, Resena],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([Estudiante, Actividad, Resena]),
];