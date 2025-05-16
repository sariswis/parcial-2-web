import { Injectable } from '@nestjs/common';
import { Usuario } from './entities/usuario.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async crearUsuario(usuario: Usuario) {
    return 'This action adds a new usuario';
  }

  async findUsuarioById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id
      }
    })
    if (!usuario) {
      throw new BusinessLogicException(
        `El usuario con id: ${id} no existe`,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return usuario;
  }

  async eliminarUsuario(id: number) {
    const usuario = await this.findUsuarioById(id);
    return await this.usuarioRepository.remove(usuario);
  }
}