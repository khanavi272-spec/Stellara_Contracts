import { IsString, IsEnum, IsArray, IsOptional, IsNumber, IsDateString, IsEmail, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKycVerificationDto {
  @ApiProperty({ description: 'User ID being verified' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'KYC provider' })
  @IsEnum(['onfido', 'jumio', 'manual'])
  provider: string;

  @ApiProperty({ description: 'Verification type' })
  @IsEnum(['identity', 'document', 'address', 'enhanced_due_diligence'])
  verificationType: string;

  @ApiProperty({ description: 'Document URLs' })
  @IsArray()
  @IsString({ each: true })
  documents: string[];

  @ApiProperty({ description: 'User personal information' })
  @IsOptional()
  personalInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

export class UpdateKycVerificationDto {
  @ApiProperty({ description: 'Verification status' })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected', 'requires_review'])
  status?: string;

  @ApiProperty({ description: 'Provider verification ID' })
  @IsOptional()
  @IsString()
  providerVerificationId?: string;

  @ApiProperty({ description: 'Rejection reason' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiProperty({ description: 'KYC tier level' })
  @IsOptional()
  @IsNumber()
  kycTier?: number;

  @ApiProperty({ description: 'Verification metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateSanctionsCheckDto {
  @ApiProperty({ description: 'User ID being checked' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Sanctions list source' })
  @IsEnum(['ofac', 'un', 'eu', 'hmt', 'custom'])
  listSource: string;

  @ApiProperty({ description: 'Search criteria' })
  searchCriteria: {
    fullName: string;
    dateOfBirth?: string;
    nationality?: string;
    address?: string;
    identificationNumber?: string;
  };
}

export class CreateRiskAssessmentDto {
  @ApiProperty({ description: 'User ID being assessed' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'KYC verification ID' })
  @IsOptional()
  @IsUUID()
  kycVerificationId?: string;

  @ApiProperty({ description: 'Risk factors and weights' })
  @IsOptional()
  riskFactors?: Record<string, number>;

  @ApiProperty({ description: 'Manual override' })
  @IsOptional()
  manualOverride?: boolean;

  @ApiProperty({ description: 'Override reason' })
  @IsOptional()
  @IsString()
  overrideReason?: string;
}

export class ComplianceReportDto {
  @ApiProperty({ description: 'Report type' })
  @IsEnum(['kyc_summary', 'suspicious_activity', 'regulatory_filing', 'audit_report'])
  reportType: string;

  @ApiProperty({ description: 'Report period start date' })
  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @ApiProperty({ description: 'Report period end date' })
  @IsOptional()
  @IsDateString()
  periodEnd?: string;

  @ApiProperty({ description: 'Report content' })
  @IsOptional()
  content?: Record<string, any>;
}
