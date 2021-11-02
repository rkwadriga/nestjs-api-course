import {Controller, Get, Post, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {AuthService} from "./auth.service";
import {CurrentUser} from "./current-user.decorator";
import {User} from "./user.entity";

@Controller('/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}
    
    @Post('/login')
    @UseGuards(AuthGuard('local')) // "local" is default name of guard (the second argument in PassportStrategy's controller - look at the src/auth/local.strategy.ts)
    async login(@CurrentUser() user: User) {
        return {
            userID: user.id,
            token: this.authService.getTokenForUser(user)
        };
    }
    
    @Get('/profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@CurrentUser() user: User) {
        return user;
    }
}