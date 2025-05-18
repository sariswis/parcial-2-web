import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateEstudianteDto {
    @IsInt()
    @IsNotEmpty()
    readonly numeroCedula: number;

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly correo: string;

    @IsString()
    @IsNotEmpty()
    readonly programa: string;

    @IsInt()
    @IsNotEmpty()
    readonly semestre: number;
}
