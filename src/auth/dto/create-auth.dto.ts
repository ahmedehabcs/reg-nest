import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateAuthDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.replace(/\s+/g, '').toLowerCase())
    @Matches(/^[a-z0-9_]+$/, { message: 'Username can only contain lowercase letters, numbers, and underscore (_)' })
    name!: string;

    @IsString()
    @IsEmail()
    @Transform(({ value }) => value.replace(/\s+/g, '').toLowerCase())
    email!: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @Matches(/(?=.*[a-z])/, { message: 'Password must contain a lowercase letter' })
    @Matches(/(?=.*[A-Z])/, { message: 'Password must contain an uppercase letter' })
    @Matches(/(?=.*\d)/, { message: 'Password must contain a number' })
    @Matches(/(?=.*[@#$!%*?&])/, { message: 'Password must contain a special character (@$!%*?&)' })
    @Transform(({ value }) => value.replace(/\s+/g, ''))
    password!: string;
}