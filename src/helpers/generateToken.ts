import jwt, { Secret } from 'jsonwebtoken';

export const generateToken = (payload: any, secret: Secret, expiresIn: any) => {
    const token = jwt.sign(payload, secret, {algorithm: "HS256", expiresIn});

    return token;
}