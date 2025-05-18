import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateResenaDto {
    @IsString()
    @IsNotEmpty()
    readonly comentario: string;

    @IsNumber()
    @IsNotEmpty()
    readonly calificacion: number;

    @IsDateString()
    @IsNotEmpty()
    readonly fecha: string;

    @IsNumber()
    @IsNotEmpty()
    readonly actividadId: number;

    @IsNumber()
    @IsNotEmpty()
    readonly estudianteId: number;
}
