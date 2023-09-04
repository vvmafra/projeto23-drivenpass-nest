import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";

export class SignInDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
      example: "victor@gmail.com",
      description: "Email registered by user"
    })
    email: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
      example: "123Victor!",
      description: "Password registed by user"
    })
    password: string


    constructor(params?: Partial<SignInDto>) {
        if (params) Object.assign(this, params);
      }
}
