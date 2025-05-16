import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { plainToInstance } from 'class-transformer';
import { Usuario } from './entities/usuario.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business.errors.interceptor';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  crearUsuario(@Body() createUsuarioDto: CreateUsuarioDto) {
    const usuario = plainToInstance(Usuario, createUsuarioDto);
    return this.usuariosService.crearUsuario(usuario);
  }

  @Get(':id')
  findUsuarioById(@Param('id') id: string) {
    return this.usuariosService.findUsuarioById(+id);
  }

  @Delete(':id')
  eliminarUsuario(@Param('id') id: string) {
    return this.usuariosService.eliminarUsuario(+id);
  }
}