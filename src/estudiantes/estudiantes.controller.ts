import { Controller, Get, Post, Body, Param, UseInterceptors } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business.errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { Estudiante } from './entities/estudiante.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Post()
  crearEstudiante(@Body() createEstudianteDto: CreateEstudianteDto) {
    const estudiante = plainToInstance(Estudiante, createEstudianteDto);
    return this.estudiantesService.crearEstudiante(estudiante);
  }

  @Get(':id')
  findEstudianteById(@Param('id') id: string) {
    return this.estudiantesService.findEstudianteById(+id);
  }

  @Post(':estudianteId/inscripciones/actividadId')
  inscribirseActividad(
    @Param('estudianteId') estudianteId: string, @Param('actividadId') actividadId: string,
  ) {
    return this.estudiantesService.inscribirseActividad(+estudianteId, +actividadId);
  }
  
}

