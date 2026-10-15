export class SeededRandom {
  private state: number;

  constructor(seed = Math.floor(Math.random() * 0xffffffff)) {
    const normalized = seed >>> 0;
    this.state = normalized === 0 ? 0x6d2b79f5 : normalized;
  }

  next(): number {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state / 0x100000000;
  }

  int(min: number, max: number): number {
    if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
      throw new RangeError(`Invalid integer range: ${min}..${max}`);
    }
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(values: readonly T[]): T {
    if (values.length === 0) throw new RangeError("Cannot pick from an empty collection.");
    return values[this.int(0, values.length - 1)] as T;
  }

  digits(length: number): string {
    return Array.from({ length }, () => String(this.int(0, 9))).join("");
  }

  letters(length: number): string {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length }, () => alphabet[this.int(0, alphabet.length - 1)]).join("");
  }

  alphanumeric(length: number): string {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length }, () => alphabet[this.int(0, alphabet.length - 1)]).join("");
  }
}
