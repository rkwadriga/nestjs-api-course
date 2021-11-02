import {Controller, Post, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";


@Controller('/auth')
export class AuthController {

    @Post('/login')
    @UseGuards(AuthGuard('local')) // "local" is default name of guard (the second argument in PassportStrategy's controller - look at the src/auth/local.strategy.ts)
    async login(@Request() request) {
        return {
            userID: request.user.id,
            token: 'The token will go here'
        };
    }
}