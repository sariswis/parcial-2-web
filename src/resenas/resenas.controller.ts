import { Controller, Get, Post, Body, Param, UseInterceptors } from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { EstudiantesService } from '../estudiantes/estudiantes.service';
import { ActividadesService } from '../actividades/actividades.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business.errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { Resena } from './entities/resena.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('resenas')
export class ResenasController {
  constructor(
    private readonly resenasService: ResenasService,
    private readonly estudiantesService: EstudiantesService,
    private readonly actividadesService: ActividadesService,
  ) {}

  @Post()
  async agregarResena(@Body() createResenaDto: CreateResenaDto) {
    const resena = plainToInstance(Resena, createResenaDto);

    const estudiante = await this.estudiantesService.findEstudianteById(createResenaDto.estudianteId);
    const actividad = await this.actividadesService.findActividadById(createResenaDto.actividadId);

    resena.actividad = actividad;
    resena.estudiante = estudiante;
    return this.resenasService.agregarResena(resena);
  }

  @Get(':id')
  async findResenaById(@Param('id') id: string) {
    return this.resenasService.findResenaById(parseInt(id));
  }

}
