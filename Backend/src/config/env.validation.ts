import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsOptional, IsBoolean, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

enum LogLevel {
  Trace = 'trace',
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Fatal = 'fatal',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  API_PREFIX: string;

  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;

  @IsString()
  JWT_SECRET: string;

  @IsNumber()
  JWT_EXPIRATION: number;

  @IsString()
  STELLAR_NETWORK: string;

  @IsString()
  STELLAR_RPC_URL: string;

  @IsString()
  STELLAR_NETWORK_PASSPHRASE: string;

  @IsString()
  PROJECT_LAUNCH_CONTRACT_ID: string;

  @IsString()
  ESCROW_CONTRACT_ID: string;

  @IsNumber()
  INDEXER_POLL_INTERVAL_MS: number;

  @IsNumber()
  INDEXER_REORG_DEPTH_THRESHOLD: number;

  // Logging Configuration
  @IsOptional()
  @IsEnum(LogLevel)
  LOG_LEVEL?: LogLevel;

  @IsOptional()
  @IsBoolean()
  LOG_PRETTY_PRINT?: boolean;

  @IsOptional()
  @IsString()
  SERVICE_NAME?: string;

  @IsOptional()
  @IsString()
  LOG_FORMAT?: string;

  @IsOptional()
  @IsBoolean()
  LOG_INCLUDE_CONTEXT?: boolean;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
