import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { SetupService } from './SetupService';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Setup')
@Controller({
  path: 'setup',
  version: '1',
})
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async getStat(@AuthUser() user) {
    await this.setupService.initAccount(user);
    return { success: true };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async initNFT() {
    await this.setupService.getStat();
    return { success: true };
  }
}
