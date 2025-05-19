import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Resena } from './entities/resena.entity';
import { ResenasService } from './resenas.service';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { EstudiantesService } from '../estudiantes/estudiantes.service';
import { Actividad } from '../actividades/entities/actividad.entity';
import { ActividadesService } from '../actividades/actividades.service';
import { faker } from '@faker-js/faker';

describe('ResenasService', () => {
  let resenasService: ResenasService;
  let resenaRepository: Repository<Resena>;
  let estudiantesService: EstudiantesService;
  let actividadesService: ActividadesService;
  let estudiante: Estudiante;
  let actividad: Actividad;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ResenasService, EstudiantesService, ActividadesService],
    }).compile();

    resenasService = module.get<ResenasService>(ResenasService);
    resenaRepository = module.get<Repository<Resena>>(getRepositoryToken(Estudiante));
    estudiantesService = module.get<EstudiantesService>(EstudiantesService);
    actividadesService = module.get<ActividadesService>(ActividadesService);
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await resenaRepository.clear();
    actividad = await actividadesService.crearActividad({
      id: 0,
      titulo: faker.lorem.words({ min: 1, max: 3 }).replace(/\s/g, '').padEnd(15, 'x'),
      fecha: faker.date.future().toISOString(),
      cupoMaximo: 5,
      estado: 0,
      inscritos: [],
      resenas: [],
    });

    estudiante = await estudiantesService.crearEstudiante({
      id: 0,
      numeroCedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
      nombre: faker.person.firstName(),
      correo: faker.internet.email(),
      programa: faker.lorem.word(),
      semestre: faker.number.int({ min: 1, max: 10 }),
      actividades: [],
      resenas: [],
    });
  };

  it('should be defined', () => {
    expect(resenasService).toBeDefined();
  });
});
