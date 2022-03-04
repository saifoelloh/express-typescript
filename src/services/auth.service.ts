import fs from 'fs';
import dotenv from 'dotenv';
import jwt, { sign, verify, SignOptions, VerifyOptions } from 'jsonwebtoken';

import { User } from '@prisma/client';
import { DataStoredInToken } from '@interfaces/auth.interface';

dotenv.config();

class AuthService {
  public createToken(user: User): string {
    const dataStoredInToken: DataStoredInToken = { id: user.id, role: user.role };
    const key: jwt.Secret = fs.readFileSync(__dirname + '/../../private.key');
    const signOptions: SignOptions = { algorithm: 'ES512', expiresIn: '1h' };
    const token = sign(dataStoredInToken, key, signOptions);
    return token;
  }

  public verifyToken(token: string): DataStoredInToken {
    const key: jwt.Secret = fs.readFileSync(__dirname + '/../../public.key');
    const verifyOptions: VerifyOptions = { algorithms: ['ES512'] };
    const dataStoredInToken: DataStoredInToken = verify(token, key, verifyOptions) as DataStoredInToken;
    return dataStoredInToken;
  }
}

export default AuthService;
