import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength, minLength } from "class-validator";

export class SignUpDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: "victor@gmail.com",
        description: "Email for your register"
      })
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
    @ApiProperty({
        example: "123Victor!",
        description: "Strong password for your register"
      })
    password: string

    constructor(params?: Partial<SignUpDto>) {
        if (params) Object.assign(this, params);
      }
}
