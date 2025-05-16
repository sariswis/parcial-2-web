import { Test, TestingModule } from '@nestjs/testing';
import { ResenasController } from './resenas.controller';
import { ResenasService } from './resenas.service';

describe('ResenasController', () => {
  let controller: ResenasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResenasController],
      providers: [ResenasService],
    }).compile();

    controller = module.get<ResenasController>(ResenasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
