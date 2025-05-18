import { Controller, Get, Post, Body, Put, Param, UseInterceptors } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { EstadoActividadDto } from './dto/estado-actividad.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business.errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { Actividad } from './entities/actividad.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Post()
  crearActividad(@Body() createActividadDto: CreateActividadDto) {
    const actividad = plainToInstance(Actividad, createActividadDto);
    return this.actividadesService.crearActividad(actividad);
  }

  @Put(':actividadId')
  cambiarEstado(
    @Param('actividadId') actividadId: string, @Body() updateActividadDto: EstadoActividadDto,
  ) {
    const { estado } = updateActividadDto;
    return this.actividadesService.cambiarEstado(parseInt(actividadId), estado);
  }

  @Get(':fecha')
  findAllActividadesByDate(@Param('fecha') fecha: string) {
    return this.actividadesService.findAllActividadesByDate(fecha);
  }

}
