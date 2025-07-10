import * as bcrypt from 'bcrypt';

export class BcryptService {
  constructor(private readonly rounds: number) {}
  hash(pw: string) { return bcrypt.hash(pw, this.rounds); }
  compare(pw: string, hash: string) { return bcrypt.compare(pw, hash); }
}