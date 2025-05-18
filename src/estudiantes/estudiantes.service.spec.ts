import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Estudiante } from './entities/estudiante.entity';
import { EstudiantesService } from './estudiantes.service';
import { Actividad } from '../actividades/entities/actividad.entity';
import { ActividadesService } from '../actividades/actividades.service';
import { faker } from '@faker-js/faker';

describe('EstudiantesService', () => {
  let estudiantesService: EstudiantesService;
  let actividadesService: ActividadesService;
  let estudianteRepository: Repository<Estudiante>;
  let estudiantesList: Estudiante[];
  let actividadesList: Actividad[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudiantesService, ActividadesService],
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
        actividades: [],
        resenas: [],
      });

      estudiantesList.push(estudiante);
    }

    actividadesList = [];
    for (let i = 0; i < 3; i++) {
      const actividad: Actividad = await actividadesService.crearActividad({
        id: 0,
        titulo: faker.lorem.words({ min: 1, max: 3 }).replace(/\s/g, '').padEnd(15, 'x'),
        fecha: faker.date.future().toISOString(),
        cupoMaximo: 3,
        estado: 0,
        inscritos: [],
        resenas: [],
      });

      actividadesList.push(actividad);
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

  it('crearEstudiante should return a new estudiante', async () => {
    const newEstudiante: Estudiante = await estudiantesService.crearEstudiante(estudiante);
    expect(newEstudiante).not.toBeNull();

    const storedEstudiante = await estudianteRepository.findOne({
      where: { id: newEstudiante.id },
    });
    
    expect(storedEstudiante).not.toBeNull();
    const stored = storedEstudiante as Estudiante;
    expect(stored.numeroCedula).toEqual(newEstudiante.numeroCedula);
    expect(stored.nombre).toEqual(newEstudiante.nombre);
    expect(stored.correo).toEqual(newEstudiante.correo);
    expect(stored.programa).toEqual(newEstudiante.programa);
    expect(stored.semestre).toEqual(newEstudiante.semestre);
  });

  it('crearEstudiante should throw an error with invalid email', async () => {
    let estudianteInvalido: Estudiante = estudiantesList[0];
    estudianteInvalido = {
      ...estudianteInvalido, correo: 'invalid-email',
    }
    await expect(() => estudiantesService.crearEstudiante(estudianteInvalido)).rejects.toHaveProperty("message", "El correo no es válido");
  });

  it('crearEstudiante should throw an error with invalid semester', async () => {
    let estudianteInvalido: Estudiante = estudiantesList[0];
    estudianteInvalido = {
      ...estudianteInvalido, semestre: 11,
    }
    await expect(() => estudiantesService.crearEstudiante(estudianteInvalido)).rejects.toHaveProperty("message", "El semestre debe estar entre 1 y 10");
  });

  it('findEstudianteById should return an estudiante by id', async () => {
    const storedEstudiante: Estudiante = estudiantesList[0];
    const foundEstudiante: Estudiante = await estudiantesService.findEstudianteById(storedEstudiante.id);
    expect(foundEstudiante).not.toBeNull();
    expect(foundEstudiante.numeroCedula).toEqual(storedEstudiante.numeroCedula);
    expect(foundEstudiante.nombre).toEqual(storedEstudiante.nombre);
    expect(foundEstudiante.correo).toEqual(storedEstudiante.correo);
    expect(foundEstudiante.programa).toEqual(storedEstudiante.programa);
    expect(foundEstudiante.semestre).toEqual(storedEstudiante.semestre);
  });

  it('findEstudianteById should throw an error for an invalid estudiante', async () => {
    await expect(() => estudiantesService.findEstudianteById(0)).rejects.toHaveProperty("message", "El estudiante con el id dado no existe");
  });

  it('inscribirseActividad should enroll an estudiante in an actividad', async () => {
    const storedEstudiante = estudiantesList[0];
    const storedActividad = actividadesList[0];
    const result = await estudiantesService.inscribirseActividad(storedEstudiante.id, storedActividad.id);
    expect(result).not.toBeNull();
    expect(result.actividades.length).toEqual(1);
    expect(result.actividades[0].id).toEqual(storedActividad.id);
  });

  it('inscribirseActividad should throw an error for an invalid estudiante', async () => {
    const actividadId = actividadesList[0].id;
    await expect(() => estudiantesService.inscribirseActividad(0, actividadId)).rejects.toHaveProperty("message", "El estudiante con el id dado no existe");
  });

  it('inscribirseActividad should throw an error for an already enrolled actividad', async () => {
    const storedEstudiante = estudiantesList[0];
    const storedActividad = actividadesList[0];
    await estudiantesService.inscribirseActividad(storedEstudiante.id, storedActividad.id);
    await expect(() => estudiantesService.inscribirseActividad(storedEstudiante.id, storedActividad.id)).rejects.toHaveProperty("message", "El estudiante con el id dado ya está inscrito en la actividad con el id dado");
  });

})
