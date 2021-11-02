import {Controller, Get, Post, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {AuthService} from "./auth.service";


@Controller('/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}
    
    @Post('/login')
    @UseGuards(AuthGuard('local')) // "local" is default name of guard (the second argument in PassportStrategy's controller - look at the src/auth/local.strategy.ts)
    async login(@Request() request) {
        return {
            userID: request.user.id,
            token: this.authService.getTokenForUser(request.user)
        };
    }
    
    @Get('/profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Request() request) {
        return request.user;
    }
}