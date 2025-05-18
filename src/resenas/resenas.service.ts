import { Injectable } from '@nestjs/common';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import { Resena } from './entities/resena.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActividadesService } from '../actividades/actividades.service';
import { EstudiantesService } from '../estudiantes/estudiantes.service';

@Injectable()
export class ResenasService {
  constructor(
    @InjectRepository(Resena)
    private readonly resenaRepository: Repository<Resena>,
    private readonly actividadesService: ActividadesService,
    private readonly estudiantesService: EstudiantesService,
  ) {}

  async crearResena(resena: Resena): Promise<Resena> {
    return await this.resenaRepository.save(resena);
  }

  async agregarResena(resena: Resena): Promise<Resena> {
    const actividad = await this.actividadesService.findActividadById(resena.actividad.id);
    const estudiante = await this.estudiantesService.findEstudianteById(resena.estudiante.id);

    // Validar que la actividad tenga estado 2 (Finalizada)
    if (actividad.estado != 2) {
      throw new BusinessLogicException(
        `La actividad con el id dado no tiene estado 2`,
        BusinessError.BAD_REQUEST,
      );
    }

    // Validar que el estudiante estuvo inscrito en la actividad
    const inscrito = actividad.inscritos?.some((e: any) => e.id === estudiante.id);
    if (!inscrito) {
      throw new BusinessLogicException(
        `El estudiante con el id dado no estuvo inscrito en la actividad con el id dado`,
        BusinessError.BAD_REQUEST,
      );
    }
    
    return await this.resenaRepository.save(resena);
  }

  async findResenaById(id: number): Promise<Resena> {
    const resena = await this.resenaRepository.findOne({
      where: {
        id
      }
    })
    if (!resena) {
      throw new BusinessLogicException(
        `La reseña con el id dado no existe`,
        BusinessError.NOT_FOUND,
      );
    }
    return resena;
  }

  async eliminarResena(id: number) {
    const resena = await this.findResenaById(id);
    return await this.resenaRepository.remove(resena);
  }

}
