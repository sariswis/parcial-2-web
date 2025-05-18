import { Injectable } from '@nestjs/common';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
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

  async crearEstudiante(estudiante: Estudiante): Promise<Estudiante> {
    // Validar el correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(estudiante.correo)) {
      throw new BusinessLogicException(
        'Correo inválido', 
        BusinessError.PRECONDITION_FAILED
      );
    }

    // Validar semestre entre 1 y 10
    if (estudiante.semestre < 1 || estudiante.semestre > 10) {
      throw new BusinessLogicException(
        'El semestre debe estar entre 1 y 10', 
        BusinessError.PRECONDITION_FAILED
      );
    }

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
        `El estudiante con el id dado no existe`,
        BusinessError.NOT_FOUND,
      );
    }

    return estudiante;
  }

  async inscribirseActividad(estudianteId: number, actividadId: number) {
    const estudiante = await this.findEstudianteById(estudianteId);
    const actividad = await this.actividadesService.findActividadById(actividadId);

    // La actividad debe tener cupos disponibles
    const cuposDisponibles = actividad.cupoMaximo - actividad.inscritos.length;

    if (cuposDisponibles <= 0) {
      throw new BusinessLogicException(
        `No hay cupos disponibles para la actividad con el id dado`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // La actividad debe estar en estado 0 (Abierta)
    if (actividad.estado != 0) {
      throw new BusinessLogicException(
        `La actividad con el id dado no tiene estado 0`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // No debe existir una inscripción previa
    const inscrito = actividad.inscritos?.some((e: any) => e.id === estudiante.id);
    if (inscrito) {
      throw new BusinessLogicException(
        `El estudiante con el id dado ya está inscrito en la actividad con el id dado`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    estudiante.actividades = [...estudiante.actividades, actividad];
    actividad.inscritos = [...actividad.inscritos, estudiante];
    await this.estudianteRepository.save(estudiante);
    await this.actividadesService.updateActividad(actividad.id, actividad);
  }

  async eliminarEstudiante(id: number) {
    const estudiante = await this.findEstudianteById(id);
    return await this.estudianteRepository.remove(estudiante);
  }

}