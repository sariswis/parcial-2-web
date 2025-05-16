import { Injectable } from '@nestjs/common';
import { CreateActividadeDto } from './dto/create-actividade.dto';
import { UpdateActividadeDto } from './dto/update-actividade.dto';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import { Actividad } from './entities/actividad.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
  ) {}

  async crearActividad(actividad: Actividad) {
    return await this.actividadRepository.save(actividad);
  }

  async findActividadById(id: number): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({
      where: {
        id
      }
    })
    if (!actividad) {
      throw new BusinessLogicException(
        `La actividad con id ${id} no existe`,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return actividad;
  }

  async updateActividad(id: number, actividad: Actividad) {
    const actividadEncontrada = await this.findActividadById(id);
    actividadEncontrada.titulo = actividad.titulo;
    actividadEncontrada.fecha = actividad.fecha;
    actividadEncontrada.cupoMaximo = actividad.cupoMaximo;
    actividadEncontrada.cuposDisponibles = actividad.cuposDisponibles;
    actividadEncontrada.estado = actividad.estado;
    return await this.actividadRepository.save(actividadEncontrada);
  }

  async cambiarEstado(id: number, estado: number) {
    const actividad = await this.findActividadById(id);
    actividad.estado = estado;

    if (estado == 1 && actividad.cupoMaximo * 0.8 != actividad.cuposDisponibles) {
      throw new BusinessLogicException(
        `No se puede cambiar el estado de la actividad con id ${id} a 1 porque el 80% de los cupos no están ocupados`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    if (estado == 2 && actividad.cupoMaximo != actividad.cuposDisponibles) {
      throw new BusinessLogicException(
        `No se puede cambiar el estado de la actividad con id ${id} a 2 porque hay cupos disponibles`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.actividadRepository.save(actividad);
  }

  async findAllActividadesByDate(fecha: string): Promise<Actividad[]> {
    return await this.actividadRepository.find({
      where: {
        fecha: fecha
      }
    });
  }

  async eliminarActividad(id: number) {
    const actividad = await this.findActividadById(id);
    return await this.actividadRepository.remove(actividad);
  }

}