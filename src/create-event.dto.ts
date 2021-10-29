import { IsDateString, IsString, Length } from "class-validator";


export class CreateEventDto {
    @IsString()
    @Length(5, 255, {message: 'The name length is wrong'})
    name: string;

    @IsString()
    @Length(5, 255)
    description: string;

    @IsDateString()
    when: string;

    @IsString()
    //@Length(5, 255, {groups: ['create']}) // Vlidation groups defined in controller
    //@Length(10, 20, {groups: ['update']})
    @Length(5, 255)
    address: string;
}