import { IsInt } from 'class-validator';

export class EstadoActividadDto {
    @IsInt()
    readonly estado: number;
}
