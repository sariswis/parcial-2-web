import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Estudiante } from '../../estudiantes/entities/estudiante.entity';
import { Actividad } from '../../actividades/entities/actividad.entity';

@Entity()
export class Resena {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;
    
    @Column()
    comentario: string;

    @Column()
    calificacion: number;

    @Column()
    fecha: string;

    @ManyToOne(() => Estudiante, (estudiante) => estudiante.resenas)
    estudiante: Estudiante;

    @ManyToOne(() => Actividad, (actividad) => actividad.resenas)
    actividad: Actividad;
}

