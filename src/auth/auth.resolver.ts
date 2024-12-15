import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserEntity } from '../entities/user.entity';
import { SignUpInput } from '../dtos/register-input.dto';

@Resolver(() => UserEntity)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserEntity)
  async signUp(@Args('input') input: SignUpInput): Promise<UserEntity> {
    return this.authService.signUp(input);
  }
}
