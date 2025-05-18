import { Injectable } from '@nestjs/common';
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

  async crearActividad(actividad: Actividad): Promise<Actividad> {
    // Validad la longitud del título
    if (actividad.titulo.length < 15) {
      throw new BusinessLogicException(
        'El título debe tener al menos 15 caracteres',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // Validar que el título no contenga símbolos
    const alfanumericoRegex = /^[a-zA-Z0-9 ]+$/;
    if (!alfanumericoRegex.test(actividad.titulo)) {
      throw new BusinessLogicException(
        'El título no puede tener símbolos',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // Crear con estado 0 (Abierta)
    actividad.estado = 0;

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
        `La actividad con el id dado no existe`,
        BusinessError.NOT_FOUND,
      );
    }
    return actividad;
  }

  async findAllActividadesByDate(fecha: string): Promise<Actividad[]> {
    return await this.actividadRepository.find({
      where: {
        fecha: fecha
      }
    });
  }

  async updateActividad(id: number, actividad: Actividad) {
    const actividadEncontrada = await this.findActividadById(id);
    
    if (!actividadEncontrada) {
      throw new BusinessLogicException(
        `La actividad con el id dado no existe`,
        BusinessError.NOT_FOUND,
      );
    }

    return await this.actividadRepository.save({...actividadEncontrada, actividad});
  }

  async cambiarEstado(actividadId: number, estado: number) {
    const actividad = await this.findActividadById(actividadId);

    // Validar que el estado sea 0, 1 o 2
    if (estado <= 0 || estado >= 2) {
      throw new BusinessLogicException(
        `El estado debe ser 0, 1 o 2`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // Validar que se puede cerrar la actividad (estado 1)
    if (estado == 1 && actividad.cupoMaximo * 0.8 > actividad.inscritos.length) {
      throw new BusinessLogicException(
        `No se puede cambiar el estado a 1 de la actividad con el id dado porque el 80% de los cupos todavía no están ocupados`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // Validar que se puede finalizar la actividad (estado 2)
    if (estado == 2 && actividad.cupoMaximo > actividad.inscritos.length) {
      throw new BusinessLogicException(
        `No se puede cambiar el estado  a 2 de la actividad con el id dado porque todavía hay cupos disponibles`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    actividad.estado = estado;
    return await this.actividadRepository.save(actividad);
  }

  async eliminarActividad(id: number) {
    const actividad = await this.findActividadById(id);
    return await this.actividadRepository.remove(actividad);
  }

}