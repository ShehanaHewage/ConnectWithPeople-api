import dotenv from "dotenv";
import * as jose from "jose";
import type { JwtPayload } from "../models/dtos/common.ts";

dotenv.config();

const JWT_SECRET_STRING = process.env.JWT_SECRET ?? "BP6hWBV2BBO9tdDElj1lP/sdvNeYL3+QF+0mjXxJvBo=";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";

const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export async function generateJwtToken(payload: JwtPayload): Promise<string> {
    if (!JWT_SECRET_STRING) {
        throw new Error("JWT_SECRET is not defined");
    }
    if (!JWT_EXPIRES_IN) {
        throw new Error("JWT_EXPIRES_IN is not defined");
    }

    const token = await new jose.SignJWT(payload as unknown as jose.JWTPayload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(JWT_SECRET);

    return token;
}

export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
    if (!JWT_SECRET_STRING) {
        throw new Error("JWT_SECRET is not defined");
    }

    try {
        const { payload: verifiedPayload } = await jose.jwtVerify(
            token,
            JWT_SECRET
        );
        return verifiedPayload as JwtPayload;
    } catch (error) {
        return null;
    }
}
