import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Transform } from 'class-transformer';

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Transform(({ value }) => value.replace(/\s+/g, '').toLowerCase())
    email!: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.replace(/\s+/g, ''))
    password!: string;
}