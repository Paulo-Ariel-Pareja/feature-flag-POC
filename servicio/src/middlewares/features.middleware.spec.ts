import { FeaturesMiddleware } from './features.middleware';

describe('FeaturesMiddleware', () => {
  it('should be defined', () => {
    expect(new FeaturesMiddleware()).toBeDefined();
  });
});
