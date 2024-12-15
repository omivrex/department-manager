import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../entities/user.entity";
import { SignUpInput } from "../dtos/register-input.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async signUp(input: SignUpInput): Promise<UserEntity> {
        const { username, email, password } = input;

        const existingUser = await this.userRepository.findOne({
            where: [{ email }, { username }],
        });
        if (existingUser) {
            throw new ConflictException("Username or email already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            username,
            email,
            password: hashedPassword,
        });

        return this.userRepository.save(user);
    }

    private async validateUser(username: string, password: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return user;
    }

    async login(username: string, password: string, res: any) {
        const user = await this.validateUser(username, password);

        const accessToken = this.generateAccessToken(user.id, user.email);
        const refreshToken = this.generateRefreshToken(user.id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // Set to true in production
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return { accessToken, message: "Successfully logged in" };
    }

    private generateAccessToken(userId: string, email: string): string {
        const accessTokenSecret = this.configService.get<string>("JWT_ACCESS_SECRET");
        return this.jwtService.sign({ userId, email }, { secret: accessTokenSecret, expiresIn: "1h" });
    }

    private generateRefreshToken(userId: string): string {
        const refreshTokenSecret = this.configService.get<string>("JWT_REFRESH_SECRET");
        return this.jwtService.sign({ userId }, { secret: refreshTokenSecret, expiresIn: "1d" });
    }

    async refreshAccessToken(refreshToken: string): Promise<string> {
        try {
            const refreshTokenSecret = this.configService.get<string>("JWT_REFRESH_SECRET");

            const payload = this.jwtService.verify(refreshToken, { secret: refreshTokenSecret });

            const user = await this.userRepository.findOne({ where: { id: payload.userId } });

            if (!user) {
                throw new UnauthorizedException("User not found");
            }

            return this.generateAccessToken(user.id, user.username);
        } catch (error) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }
    }
}
