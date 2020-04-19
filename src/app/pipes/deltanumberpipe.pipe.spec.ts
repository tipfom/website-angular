import { DeltaNumberPipe } from './deltanumberpipe.pipe';

describe('StatsnumberpipePipe', () => {
  it('create an instance', () => {
    const pipe = new DeltaNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
