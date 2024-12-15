import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth/auth.service";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const gqlContext = GqlExecutionContext.create(context);
        const req = gqlContext.getContext().req;
        const authorizationHeader = req.headers.authorization;
        const accessToken = authorizationHeader?.split(" ")[1];
        const refreshToken = req.cookies?.refreshToken;

        if (!accessToken) {
            throw new UnauthorizedException("Access token is required");
        }

        try {
            this.jwtService.verify(accessToken, { secret: process.env.JWT_ACCESS_SECRET });
            return true;
        } catch (err) {
            if (err.name === "TokenExpiredError" && refreshToken) {
                await this.renewAccessToken(context, refreshToken);
            } else {
                throw new UnauthorizedException("Invalid access token");
            }
        }
    }

    private async renewAccessToken(context: ExecutionContext, refreshToken: string): Promise<boolean> {
        try {
            const res = context.switchToHttp().getResponse();
            const newAccessToken = await this.authService.refreshAccessToken(refreshToken);
            res.setHeader("Authorization", `Bearer ${newAccessToken}`);
            return true;
        } catch (refreshError) {
            throw new UnauthorizedException("Invalid refresh token");
        }
    }
}
