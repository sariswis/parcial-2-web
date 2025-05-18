import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Resena } from '../../resenas/entities/resena.entity';
import { Estudiante } from '../../estudiantes/entities/estudiante.entity';

@Entity()
export class Actividad {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    titulo: string;

    @Column()
    fecha: string;

    @Column()
    cupoMaximo: number;

    @Column()
    estado: number;

    @ManyToMany(() => Estudiante, (estudiante) => estudiante.actividades)
    inscritos: Estudiante[];

    @OneToMany(() => Resena, (resena) => resena.actividad)
    resenas: Resena[];
}

