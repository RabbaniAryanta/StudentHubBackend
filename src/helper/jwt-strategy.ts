    import { Injectable } from "@nestjs/common";
    import { PassportStrategy } from "@nestjs/passport";
    import { ExtractJwt, Strategy } from "passport-jwt";
    import { ConfigService } from "@nestjs/config";

    type Payload = {
    sub: string;
    email: string;
    };

    @Injectable()
    export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.get("JWT_VERIFY") || "DavinFalih",
        });
    }

async validate(payload: any) {
return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role
};
}
}