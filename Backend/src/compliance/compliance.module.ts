import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

// Entities
import { KycVerification } from './entities/kyc-verification.entity';
import { ComplianceReport } from './entities/compliance-report.entity';
import { SanctionsCheck } from './entities/sanctions-check.entity';
import { RiskAssessment } from './entities/risk-assessment.entity';

// Services
import { KycService } from './services/kyc.service';
import { ComplianceService } from './services/compliance.service';
import { SanctionsService } from './services/sanctions.service';
import { RiskScoringService } from './services/risk-scoring.service';
import { OnfidoService } from './providers/onfido.service';
import { JumioService } from './providers/jumio.service';

// Controllers
import { ComplianceController } from './controllers/compliance.controller';

// Import other modules
import { AuditModule } from '../audit/audit.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KycVerification,
      ComplianceReport,
      SanctionsCheck,
      RiskAssessment,
    ]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService) => ({
        timeout: configService.get('HTTP_TIMEOUT', 30000),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS', 5),
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    AuditModule,
    AuthModule,
  ],
  controllers: [ComplianceController],
  providers: [
    // Services
    KycService,
    ComplianceService,
    SanctionsService,
    RiskScoringService,
    
    // Provider Services
    OnfidoService,
    JumioService,
  ],
  exports: [
    KycService,
    ComplianceService,
    SanctionsService,
    RiskScoringService,
    TypeOrmModule,
  ],
})
export class ComplianceModule {}
