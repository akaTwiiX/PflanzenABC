import { CommaDecimalPipe } from './comma-decimal.pipe';

describe('CommaDecimalPipe', () => {
  it('create an instance', () => {
    const pipe = new CommaDecimalPipe();
    expect(pipe).toBeTruthy();
  });
});
