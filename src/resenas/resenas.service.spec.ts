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
  let resena: Resena;

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
      fecha: faker.date.past().toISOString(),
      cupoMaximo: 1,
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
      actividades: [actividad],
      resenas: [],
    });

    actividad.estado = 2; // Finalizar la actividad
    actividad.inscritos = [estudiante];
    actividad = await actividadesService.updateActividad(actividad.id, actividad);

    resena = {
      id: 1,
      comentario: faker.lorem.sentence(),
      calificacion: faker.number.int({ min: 1, max: 5 }),
      fecha: faker.date.future().toISOString(),
      estudiante: estudiante,
      actividad: actividad,
    };
  };

  it('should be defined', () => {
    expect(resenasService).toBeDefined();
  });

  it('should create a resena', async () => {
    const resenaCreada = await resenasService.agregarResena(resena);

    expect(resenaCreada).not.toBeNull();
    expect(resenaCreada.comentario).toEqual(resena.comentario);
    expect(resenaCreada.calificacion).toEqual(resena.calificacion);
    expect(resenaCreada.fecha).toEqual(resena.fecha);

    expect(resenaCreada.estudiante).not.toBeNull();
    expect(resenaCreada.estudiante).toEqual(estudiante);
    expect(resenaCreada.actividad).not.toBeNull();
    expect(resenaCreada.actividad).toEqual(actividad);
  });

  it('should throw an error if the activity is not finished', async () => {
    actividad.estado = 1;
    const updatedActividad = await actividadesService.updateActividad(actividad.id, actividad);
    resena.actividad = updatedActividad;

    await expect(() => resenasService.agregarResena(resena)).rejects.toHaveProperty('message', 'La actividad con el id dado no tiene estado 2');
  });

  it('should throw an error if the activity does not have the student enrolled', async () => {
    actividad.inscritos = [];
    const updatedActividad = await actividadesService.updateActividad(actividad.id, actividad);
    resena.actividad = updatedActividad;

    await expect(() => resenasService.agregarResena(resena)).rejects.toHaveProperty('message', 'El estudiante con el id dado no estuvo inscrito en la actividad con el id dado');
  });

  it('should throw an error if the student is not enrolled in the activity', async () => {
    estudiante.actividades = [];
    const updatedEstudiante = await estudiantesService.updateEstudiante(estudiante.id, estudiante);
    resena.estudiante = updatedEstudiante;

    await expect(() => resenasService.agregarResena(resena)).rejects.toHaveProperty('message', 'El estudiante con el id dado no estuvo inscrito en la actividad con el id dado');
  });

  it('should get a resena by id', async () => {
    const resenaCreada = await resenasService.agregarResena(resena);
    const resenaEncontrada = await resenasService.findResenaById(resenaCreada.id);

    expect(resenaEncontrada).not.toBeNull();
    expect(resenaEncontrada.comentario).toEqual(resenaCreada.comentario);
    expect(resenaEncontrada.calificacion).toEqual(resenaCreada.calificacion);
    expect(resenaEncontrada.fecha).toEqual(resenaCreada.fecha);
  });

  it('should throw an error if the resena does not exist', async () => {
    await resenasService.agregarResena(resena);
    await expect(() => resenasService.findResenaById(0)).rejects.toHaveProperty('message', 'La reseña con el id dado no existe');
  });
});
