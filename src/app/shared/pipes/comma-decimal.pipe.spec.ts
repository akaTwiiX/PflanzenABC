import { CommaDecimalPipe } from '@/shared/pipes/comma-decimal.pipe';

describe('commaDecimalPipe', () => {
  it('create an instance', () => {
    const pipe = new CommaDecimalPipe();
    expect(pipe).toBeTruthy();
  });
});
