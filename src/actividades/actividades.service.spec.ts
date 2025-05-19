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
        id: i,
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

  const actividad: Actividad = {
    id: 0,
    titulo: faker.lorem.words({ min: 1, max: 3 }).replace(/\s/g, '').padEnd(15, 'x'),
    fecha: faker.date.future().toISOString(),
    cupoMaximo: 5,
    estado: 0,
    inscritos: [],
    resenas: [],
  };

  it('crearActividad should create an actividad', async () => {
    const newActividad: Actividad = await actividadesService.crearActividad(actividad);
    expect(newActividad).not.toBeNull();

    const storedActividad = await actividadRepository.findOneBy({ id: newActividad.id });
    const stored = storedActividad as Actividad;
    expect(stored).not.toBeNull();
    expect(stored.titulo).toEqual(actividad.titulo);
    expect(stored.fecha).toEqual(actividad.fecha);
    expect(stored.cupoMaximo).toEqual(actividad.cupoMaximo);
    expect(stored.estado).toEqual(actividad.estado);
  });

  it('crearActividad should throw an exception for title with symbols', async () => {
    let actividadInvalida: Actividad = actividadesList[0];
    actividadInvalida = {
      ...actividadInvalida, titulo: 'Actividad con símbolo #',
    }
    await expect(() => actividadesService.crearActividad(actividadInvalida)).rejects.toHaveProperty(
      'message',
      'El título no puede tener símbolos',
    );
  });

  it('crearActividad should throw an exception for title with less than 3 characters', async () => {
    let actividadInvalida: Actividad = actividadesList[0];
    actividadInvalida = {
      ...actividadInvalida, titulo: 'Ac',
    }
    await expect(() => actividadesService.crearActividad(actividadInvalida)).rejects.toHaveProperty(
      'message',
      'El título debe tener al menos 15 caracteres',
    );
  });

  it('cambiarEstado should change the estado of an actividad', async () => {
    let actividadPrueba: Actividad = actividadesList[0];
    actividadPrueba.inscritos = estudiantesList.slice(0, 4);
    await actividadRepository.save(actividadPrueba);

    const estado = 1;
    const updatedActividad: Actividad = await actividadesService.cambiarEstado(actividadPrueba.id, estado);
    expect(updatedActividad).not.toBeNull();
    expect(updatedActividad.estado).toEqual(estado);
  })

  it('cambiarEstado should throw an exception for invalid estado', async () => {
    let actividadPrueba: Actividad = actividadesList[0];
    actividadPrueba.inscritos = estudiantesList.slice(0, 4);
    await actividadRepository.save(actividadPrueba);

    const estado = 3;
    await expect(() => actividadesService.cambiarEstado(actividadPrueba.id, estado)).rejects.toHaveProperty(
      'message',
      'El estado debe ser 0, 1 o 2',
    );
  });

  it('cambiarEstado should throw an exception for not reaching the eighty percent', async () => {
    let actividadPrueba: Actividad = actividadesList[0];
    actividadPrueba.inscritos = estudiantesList.slice(0, 3);
    await actividadRepository.save(actividadPrueba);

    const estado = 1;
    await expect(() => actividadesService.cambiarEstado(actividadPrueba.id, estado)).rejects.toHaveProperty(
      'message',
      'No se puede cambiar el estado a 1 de la actividad con el id dado porque el 80% de los cupos todavía no están ocupados',
    );
  })

  it('cambiarEstado should throw an exception for not reaching the cupoMaximo', async () => {
    let actividadPrueba: Actividad = actividadesList[0];
    actividadPrueba.inscritos = estudiantesList.slice(0, 4);
    await actividadRepository.save(actividadPrueba);

    const estado = 2;
    await expect(() => actividadesService.cambiarEstado(actividadPrueba.id, estado)).rejects.toHaveProperty(
      'message',
      'No se puede cambiar el estado a 2 de la actividad con el id dado porque todavía hay cupos disponibles',
    );
  })

  it('findAllActividadesByDate should return all actividades by date', async () => {
    const fecha = actividadesList[0].fecha;
    const actividades: Actividad[] = await actividadesService.findAllActividadesByDate(fecha);
    expect(actividades).not.toBeNull();
    expect(actividades.length).toBeGreaterThanOrEqual(1);
  });

  it('findAllActividadesByDate should return an empty array if no actividades found', async () => {
    const fecha = '2024-01-01';
    const actividades: Actividad[] = await actividadesService.findAllActividadesByDate(fecha);
    expect(actividades).not.toBeNull();
    expect(actividades.length).toEqual(0);
  });

});
