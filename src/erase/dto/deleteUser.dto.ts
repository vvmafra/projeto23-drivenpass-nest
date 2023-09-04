import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";

export class DeleteUserDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: "victor@gmail.com",
        description: "Email registered by user"
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
    })
    @ApiProperty({
        example: "123Victor!",
        description: "Password registed by user"
      })
    password: string

}
