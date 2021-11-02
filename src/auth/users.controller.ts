import {BadRequestException, Body, Controller, Logger, Post} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {CreateUserDto} from "./input/create.user.dto";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";


@Controller('/users')
export  class UsersController{
    private readonly logger = new Logger(UsersController.name);
    
    constructor(
        private readonly authService: AuthService,
        
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}
    
    @Post()
    async create(@Body() input: CreateUserDto) {
        let errors: Array<string> = [];
        
        // Check the "retype password" field
        if (input.password !== input.retypedPassword) {
            errors.push('Passwords are not identical');
        }
        
        // Check the username and email are unique
        let existingUser = await this.userRepository.findOne({username: input.username});
        if (existingUser) {
            errors.push('This username is already registered');
        }
        existingUser = await this.userRepository.findOne({email: input.email});
        if (existingUser) {
            errors.push('This email is already registered');
        }
        
        // If there is some errors - throw an 400 error
        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }
        
        // Save the user info in DB
        const user = await this.userRepository.save({
            ...input,
            password: await this.authService.hashPassword(input.password)
        });
        
        // Return user info + new token
        return {
            ...user,
            token: this.authService.getTokenForUser(user)
        };
    }
}
