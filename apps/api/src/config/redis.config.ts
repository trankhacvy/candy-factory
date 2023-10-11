import { registerAs } from '@nestjs/config';
import { DatabaseConfig, RedisConfig } from './config.type';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.REDIS_HOST)
  @IsString()
  REDIS_HOST: string;

  @ValidateIf((envValues) => !envValues.REDIS_HOST)
  @IsString()
  REDIS_USERNAME: string;

  @ValidateIf((envValues) => !envValues.REDIS_HOST)
  @IsString()
  REDIS_PASSWORD: string;

  @ValidateIf((envValues) => !envValues.REDIS_HOST)
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  REDIS_PORT: number;

}

export default registerAs<RedisConfig>('redis', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT
      ? parseInt(process.env.REDIS_PORT, 10)
      : 7381,
  };
});
