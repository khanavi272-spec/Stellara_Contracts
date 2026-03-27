import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// logging and error handling
import { LoggingModule } from './logging/logging.module';
import { StructuredLogger } from './logging/structured-logger.service';

import { RedisModule } from './redis/redis.module';
import { VoiceModule } from './voice/voice.module';
// DatabaseModule removed - using PostgreSQL config in this module instead
import { StellarMonitorModule } from './stellar-monitor/stellar-monitor.module';
import { WorkflowModule } from './workflow/workflow.module';
import { QueueModule } from './queue/queue.module';
import { AuthModule } from './auth/auth.module';
import { MarketDataModule } from './market-data/market-data.module';

import { RolesGuard } from './guards/roles.guard';

import { Workflow } from './workflow/entities/workflow.entity';
import { WorkflowStep } from './workflow/entities/workflow-step.entity';
import { User } from './auth/entities/user.entity';
import { WalletBinding } from './auth/entities/wallet-binding.entity';
import { LoginNonce } from './auth/entities/login-nonce.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { ApiToken } from './auth/entities/api-token.entity';
import { AuditModule } from './audit/audit.module';
import { AuditLog } from './audit/audit.entity';
import { GdprModule } from './gdpr/gdpr.module';
import { Consent } from './gdpr/entities/consent.entity';
import { VoiceJob } from './voice/entities/voice-job.entity';
import { ThrottleModule } from './throttle/throttle.module';
import { ContractInteractionModule } from './contract-interaction/contract-interaction.module';
import { TransactionRecord } from './contract-interaction/entities/transaction-record.entity';
import { ContractMetadata } from './contract-interaction/entities/contract-metadata.entity';
import { SearchModule } from './search/search.module';
import { AdminModule } from './admin/admin.module';
import { DataExportModule } from './data-export/data-export.module';
import { ExportJob } from './data-export/entities/export-job.entity';
import { ComplianceModule } from './compliance/compliance.module';
import { KycVerification } from './compliance/entities/kyc-verification.entity';
import { ComplianceReport } from './compliance/entities/compliance-report.entity';
import { SanctionsCheck } from './compliance/entities/sanctions-check.entity';
import { RiskAssessment } from './compliance/entities/risk-assessment.entity';


@Module({
  imports: [
    // logging comes first so correlation middleware wraps every request
    LoggingModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USERNAME') || 'postgres',
        password: configService.get('DB_PASSWORD') || 'password',
        database:
          configService.get('DB_DATABASE') || 'stellara_workflows',
        entities: [
          Workflow,
          WorkflowStep,
          User,
          WalletBinding,
          LoginNonce,
          RefreshToken,
          ApiToken,
          AuditLog,
          Consent,
          VoiceJob,
          TransactionRecord,
          ContractMetadata,
          ExportJob,
          KycVerification,
          ComplianceReport,
          SanctionsCheck,
          RiskAssessment,
        ],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),

    RedisModule,
    AuthModule,
    VoiceModule,
    StellarMonitorModule,
    WorkflowModule,
    QueueModule,
    MarketDataModule,
    AuditModule,
    GdprModule,
    ThrottleModule,
    ContractInteractionModule,
    SearchModule,
    AdminModule,
    DataExportModule,
    ComplianceModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,

    /**
     * Global RBAC enforcement
     * Applies @Roles() checks across all controllers
     */
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // replace the default Nest logger with our structured implementation
    {
      provide: Logger,
      useClass: StructuredLogger,
    },
  ],
})
export class AppModule {}
