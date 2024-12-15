import { Resolver, Mutation, Args, Context } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { UserEntity } from "../entities/user.entity";
import { SignUpInput } from "../dtos/register-input.dto";
import { LoginResponse } from "../dtos/login-output.dto";

@Resolver(() => UserEntity)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => UserEntity)
    async signUp(@Args("input") input: SignUpInput): Promise<UserEntity> {
        return this.authService.signUp(input);
    }

    @Mutation(() => LoginResponse)
    async login(@Args("username") username: string, @Args("password") password: string, @Context() context: any): Promise<LoginResponse> {
        const res = context.res;
        return this.authService.login(username, password, res);
    }
}
