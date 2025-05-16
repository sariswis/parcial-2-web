import { Injectable } from '@nestjs/common';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
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

  async agregarResena(resena: Resena) {
    const actividad = await this.actividadesService.findActividadById(resena.actividad.id);
    const estudiante = await this.estudiantesService.findEstudianteById(resena.estudiante.id);

    if (actividad.estado != 2) {
      throw new BusinessLogicException(
        `La actividad con id ${resena.actividad.id} no tiene estado 2`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    const inscrito = actividad.inscritos?.some((e: any) => e.id === estudiante.id);
    if (!inscrito) {
      throw new BusinessLogicException(
      `El estudiante con id ${estudiante.id} no estuvo inscrito en la actividad con id ${actividad.id}`,
      BusinessError.PRECONDITION_FAILED,
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
        `El resena con id ${id} no existe`,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return resena;
  }

  async eliminarResena(id: number) {
    const resena = await this.findResenaById(id);
    return await this.resenaRepository.remove(resena);
  }

}
