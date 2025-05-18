import { IsNotEmpty, IsString, IsDateString, IsInt } from 'class-validator';

export class CreateActividadDto {
    @IsString()
    @IsNotEmpty()
    readonly titulo: string;

    @IsDateString()
    @IsNotEmpty()
    readonly fecha: string;

    @IsInt()
    @IsNotEmpty()
    readonly cupoMaximo: number;

    @IsInt()
    readonly estado: number;
}
