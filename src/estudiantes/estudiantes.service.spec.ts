import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Estudiante } from './entities/estudiante.entity';
import { EstudiantesService } from './estudiantes.service';
import { ActividadesService } from '../actividades/actividades.service';
import { faker } from '@faker-js/faker';

describe('EstudiantesService', () => {
  let estudiantesService: EstudiantesService;
  let actividadesService: ActividadesService;
  let estudianteRepository: Repository<Estudiante>;
  let estudiantesList: Estudiante[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudiantesService],
    }).compile();

    estudiantesService = module.get<EstudiantesService>(EstudiantesService);
    estudianteRepository = module.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
    actividadesService = module.get<ActividadesService>(ActividadesService);
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await estudianteRepository.clear();
    estudiantesList = [];
    for (let i = 0; i < 3; i++) {
      const estudiante: Estudiante = await estudianteRepository.save({
        numeroCedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
        nombre: faker.person.firstName(),
        correo: faker.internet.email(),
        programa: faker.lorem.word(),
        semestre: faker.number.int({ min: 1, max: 10 }),
      });

      estudiantesList.push(estudiante);
    }
  };

  it('should be defined', () => {
    expect(estudiantesService).toBeDefined();
  });

  const estudiante: Estudiante = {
    id: 0,
    numeroCedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
    nombre: faker.person.firstName(),
    correo: faker.internet.email(),
    programa: faker.lorem.word(),
    semestre: faker.number.int({ min: 1, max: 10 }),
    actividades: [],
    resenas: [],
  };

  it('create should return a new estudiante', async () => {
    const newEstudiante: Estudiante = await estudiantesService.crearEstudiante(estudiante);
    expect(newEstudiante).not.toBeNull();

    const storedEstudiante = await estudianteRepository.findOne({
      where: { id: newEstudiante.id },
    });
    
    expect(storedEstudiante).not.toBeNull();
    const stored = storedEstudiante as Estudiante;
    expect(stored.numeroCedula).toEqual(estudiante.numeroCedula);
    expect(stored.nombre).toEqual(estudiante.nombre);
    expect(stored.correo).toEqual(estudiante.correo);
    expect(stored.programa).toEqual(estudiante.programa);
    expect(stored.semestre).toEqual(estudiante.semestre);
    expect(stored.actividades).toEqual(estudiante.actividades);
    expect(stored.resenas).toEqual(estudiante.resenas);
  });

  it('should throw an error with invalid email', async () => {
    let estudiante: Estudiante = estudiantesList[0];
    estudiante = {
      ...estudiante, correo: 'invalid-email',
    }
    await expect(() => estudiantesService.crearEstudiante(estudiante)).rejects.toHaveProperty("message", "El correo no es válido");
  });

  it('should throw an error with invalid email', async () => {
    let estudiante: Estudiante = estudiantesList[0];
    estudiante = {
      ...estudiante, semestre: 11,
    }
    await expect(() => estudiantesService.crearEstudiante(estudiante)).rejects.toHaveProperty("message", "El semestre debe estar entre 1 y 10");
  });

})
