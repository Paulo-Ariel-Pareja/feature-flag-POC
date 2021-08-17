import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { FeaturesService } from '../features/features.service';

@Injectable()
export class FeaturesMiddleware implements NestMiddleware {
  constructor(private readonly validator: FeaturesService) {}
  use(req: any, res: any, next: () => void) {
    const method = req.method;
    const path = req.originalUrl;
    if (!this.validator.getFeature(`${path}-${method}`)) {
      throw new ForbiddenException();
    }
    next();
  }
}
