import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Actividad } from './entities/actividad.entity';
import { ActividadesService } from './actividades.service';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { EstudiantesService } from '../estudiantes/estudiantes.service';
import { faker } from '@faker-js/faker';

describe('ActividadesService', () => {
  let actividadesService: ActividadesService;
  let actividadRepository: Repository<Actividad>;
  let estudiantesService: EstudiantesService;
  let actividadesList: Actividad[];
  let estudiantesList: Estudiante[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActividadesService, EstudiantesService],
    }).compile();

    estudiantesService = module.get<EstudiantesService>(EstudiantesService);
    actividadesService = module.get<ActividadesService>(ActividadesService);
    actividadRepository = module.get<Repository<Actividad>>(getRepositoryToken(Actividad));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await actividadRepository.clear();
    actividadesList = [];
    for (let i = 0; i < 3; i++) {
      const actividad: Actividad = await actividadRepository.save({
        titulo: faker.lorem.words({ min: 1, max: 3 }).replace(/\s/g, '').padEnd(15, 'x'),
        fecha: faker.date.future().toISOString(),
        cupoMaximo: 5,
        estado: 0,
        inscritos: [],
        resenas: [],
      });

      actividadesList.push(actividad);
    }

    estudiantesList = [];
    for (let i = 0; i < 5; i++) {
      const estudiante: Estudiante = await estudiantesService.crearEstudiante({
        id: 0,
        numeroCedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
        nombre: faker.person.firstName(),
        correo: faker.internet.email(),
        programa: faker.lorem.word(),
        semestre: faker.number.int({ min: 1, max: 10 }),
        actividades: [],
        resenas: [],
      });

      estudiantesList.push(estudiante);
    }
  }

  it('should be defined', () => {
    expect(actividadesService).toBeDefined();
  });
});
