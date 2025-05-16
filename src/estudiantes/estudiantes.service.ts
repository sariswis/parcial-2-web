import { Injectable } from '@nestjs/common';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { Estudiante } from './entities/estudiante.entity';
import { ActividadesService } from '../actividades/actividades.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    private readonly actividadesService: ActividadesService,
  ) {}

  async crearEstudiante(estudiante: Estudiante) {
    return await this.estudianteRepository.save(estudiante);
  }

  async findEstudianteById(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: {
        id
      }
    })
    if (!estudiante) {
      throw new BusinessLogicException(
        `El estudiante con id ${id} no existe`,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return estudiante;
  }

  async eliminarEstudiante(id: number) {
    const estudiante = await this.findEstudianteById(id);
    return await this.estudianteRepository.remove(estudiante);
  }

  // todo
  async inscribirseActividad(idEstudiante: number, idActividad: number) {
    const estudiante = await this.findEstudianteById(idEstudiante);
    const actividad = await this.actividadesService.findActividadById(idActividad);
    if (actividad.cuposDisponibles <= 0) {
      throw new BusinessLogicException(
        `No hay cupos disponibles para la actividad con id ${idActividad}`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    if (actividad.estado != 0) {
      throw new BusinessLogicException(
        `La actividad con id ${idActividad} no está tiene estado 0`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    estudiante.actividades = [...estudiante.actividades, actividad];
    actividad.inscritos = [...actividad.inscritos, estudiante];
    actividad.cuposDisponibles -= 1;
    await this.estudianteRepository.save(estudiante);
    await this.actividadesService.updateActividad(actividad.id, actividad);
  }
}