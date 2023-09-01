import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";

export class SignUpDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @MinLength(10)
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 10,
        minNumbers: 1,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1
    }) // check if has uper and lower case,. number and special character
    password: string

    constructor(params?: Partial<SignUpDto>) {
        if (params) Object.assign(this, params);
      }
}
