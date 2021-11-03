import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    SerializeOptions,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {CurrentUser} from "./current-user.decorator";
import {User} from "./user.entity";
import {AuthGuardLocal} from "./auth-guard.local";
import {AuthGuardJwt} from "./auth-guard.jwt";

@Controller('/auth')
@SerializeOptions({strategy: 'excludeAll'})
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}
    
    @Post('/login')
    @UseGuards(AuthGuardLocal) // "local" is default name of guard (the second argument in PassportStrategy's controller - look at the src/auth/local.strategy.ts)
    async login(@CurrentUser() user: User) {
        return {
            userID: user.id,
            token: this.authService.getTokenForUser(user)
        };
    }
    
    @Get('/profile')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async getProfile(@CurrentUser() user: User) {
        return user;
    }
}