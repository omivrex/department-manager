import { Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class DepartmentsResolver {
    @Query(() => String)
    getHello(): string {
        return "hello";
    }
}
