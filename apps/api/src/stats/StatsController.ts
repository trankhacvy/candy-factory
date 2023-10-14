import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StatDto } from './dto/stat.dto';
import { StatService } from './StatsServices';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Stat')
@Controller({
  path: 'stat',
  version: '1',
})
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getStat(@AuthUser() user): Promise<StatDto> {
    return this.statService.getStat(user);
  }
}
