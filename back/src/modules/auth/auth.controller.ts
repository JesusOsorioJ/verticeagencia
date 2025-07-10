import {
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 200, description: 'Usuario autenticado y se retorna JWT.' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
  async login(@GetUser() user: Usuarios) {
    return this.authService.login(user);
  }

}
