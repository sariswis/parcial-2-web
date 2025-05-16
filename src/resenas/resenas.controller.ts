import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';

@Controller('resenas')
export class ResenasController {
  constructor(private readonly resenasService: ResenasService) {}

}
