import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private limiter;

  constructor(
    private options: {
      windowMs?: number;
      max?: number;
      handler?: (req: Request, res: Response) => void;
    } = {},
  ) {
    this.limiter = rateLimit({
      windowMs: options.windowMs || 15 * 60 * 1000, // default 15 minutes
      max: options.max || 100, // default limit each IP to 100 requests per windowMs
      handler:
        options.handler ||
        ((req: Request, res: Response) => {
          res.status(429).send('Too many requests, please try again later.');
        }),
    });
  }

  canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    return new Promise<boolean>((resolve) => {
      this.limiter(req, res, () => resolve(true));
    });
  }
}
