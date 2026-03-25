import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        sub?: string;
        tenantId?: string;
        walletAddress?: string;
        roles?: string[];
        [key: string]: any;
      };
    }
  }
}

export {};
