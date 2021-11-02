import {IsEmail, IsString, Length} from "class-validator";


export class CreateUserDto {
    @IsString()
    @Length(5, 255)
    username: string;
    
    @IsString()
    @Length(8, 255)
    password: string;
    
    @IsString()
    @Length(8, 255)
    retypedPassword: string;
    
    @IsString()
    @Length(2, 64)
    firstName: string;
    
    @IsString()
    @Length(2, 64)
    lastName: string;
    
    @IsEmail()
    email: string;
}