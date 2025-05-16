import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable} from 'typeorm';
import { Actividad } from '../../actividades/entities/actividad.entity';
import { Resena } from '../../resenas/entities/resena.entity';

@Entity()
export class Estudiante {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    numeroCedula: number;

    @Column()
    nombre: string;

    @Column()
    correo: string;

    @Column()
    programa: string;

    @Column()
    semestre: number;

    @ManyToMany(() => Actividad, (actividad) => actividad.inscritos)
    @JoinTable()
    actividades: Actividad[];

    @OneToMany(() => Resena, (resena) => resena.estudiante)
    resenas: Resena[];

}
