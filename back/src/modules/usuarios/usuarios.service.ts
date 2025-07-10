import { ConfigType } from '@nestjs/config';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Usuarios } from './entities/usuarios.entity';
import {
  CreateUsuariosDto,
  UpdatePasswordDto,
} from './dto/create-usuarios.dto';
import { UpdateUsuariosDto } from './dto/update-usuarios.dto';
import { RoleStatus } from 'src/modules/usuarios/entities/usuarios.entity';
import config from 'src/config/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/modules/common/services/base.service';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { BcryptService } from 'src/libs/bcrypt/bcrypt.service';
import { JwtService } from 'src/libs/jwt/jwt.service';

@Injectable()
export class UsuariosService extends BaseService<
  Usuarios,
  CreateUsuariosDto,
  UpdateUsuariosDto
> {
  constructor(
    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    private bcryptService: BcryptService,
    private jwtService: JwtService
  ) {
    super(usuariosRepository);
  }

  async create(dto: CreateUsuariosDto): Promise<Usuarios> {
    const email = dto.email.toLowerCase();

    const existingUser = await this.usuariosRepository.findOne({
      where: [{ email }],
    });

    if (existingUser) {
      throw new ConflictException(
        'El correo o nombre de usuario ya está en uso',
      );
    }

    const hashedPassword = await this.bcryptService.hash(dto.password);

    const user = this.usuariosRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const saved = await this.usuariosRepository.save(user);
   
    return saved;
  }

  async findByEmailOrUsername(value: string): Promise<any> {
    const identifier = value.toLowerCase();
    return this.usuariosRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('(user.email = :identifier)', {
        identifier,
      })
      .getOne();
  }

  async findByEmailOrUsernameActive(value: string): Promise<any> {
    const identifier = value.toLowerCase();
    return await this.usuariosRepository.findOne({
      where: [
        { email: identifier }
      ],
    });
  }

  async updateAnyField(id: string, dto: UpdateUsuariosDto): Promise<Usuarios | null> {
    const response = await this.usuariosRepository.save({ id, ...dto });
    return response;
  }

  async updatePassword(
    dto: UpdatePasswordDto,
    reqUser: Usuarios,
  ): Promise<any> {
    let id = reqUser.id;
    if (reqUser.rol == RoleStatus.admin && dto.id) id = dto.id;

    const user = await this.usuariosRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) throw new UnauthorizedException('Credenciales no válidas');

    const isMatch = await this.bcryptService.compare(dto.currentPassword, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales no válidas');

    const hashedPassword = await this.bcryptService.hash(dto.newPassword);
    await this.usuariosRepository.save({ id, password: hashedPassword });
    return { message: 'contraseña cambiado exitosamente' };
  }

  async confirmEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.action !== 'confirmEmail')
        throw new BadRequestException('Acción inválida');

      const user = await this.usuariosRepository.findOne({
        where: { id: payload.id },
      });
      if (!user) throw new NotFoundException('Usuario no encontrado');

      await this.usuariosRepository.save(user);
    } catch (err) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  findRelationWithPropertyPath(fieldName: string): RelationMetadata {
    const rel = this.repo.metadata.relations.find(
      (r) =>
        r.relationType === 'many-to-one' &&
        r.joinColumns.some((jc) => jc.databaseName === fieldName),
    );
    if (!rel) {
      throw new BadRequestException(
        `El campo '${fieldName}' no es una columna FK de relación ManyToOne válida`,
      );
    }
    return rel;
  }
}
