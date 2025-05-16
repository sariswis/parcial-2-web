import { Entity, Column, OneToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
// import { Bono } from '../../bonos/entities/bono.entity';

export enum RolUsuario {
    PROFESOR = 'profesor',
    DECANA = 'decana'
}

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  grupoInvestigacion: string;

  @Column()
  numeroExtension: number

/*   @Column({
    type: "enum",
    enum: RolUsuario,
    default: RolUsuario.PROFESOR
  }) */
  @Column()
  rol: string;

  @OneToOne(() => Usuario, (usuario) => usuario.supervisado)
  jefe: Usuario;

  @OneToOne(() => Usuario, (usuario) => usuario.jefe)
  supervisado: Usuario;
}
