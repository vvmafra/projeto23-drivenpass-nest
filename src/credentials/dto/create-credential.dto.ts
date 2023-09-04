import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCredentialDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
      example: "Gmail Credential",
      description: "Credential's Title"
    })
    title: string

    @IsString()
    @IsUrl()
    @IsNotEmpty()
    @ApiProperty({
      example: "https://mail.google.com/mail",
      description: "Credential's URL"
    })
    url: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
      example: "vvmafra",
      description: "Credential's username"
    })
    user: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
      example: "1234556789bb",
      description: "Credential's password"
    })
    password: string

    constructor(params?: Partial<CreateCredentialDto>) {
        if (params) Object.assign(this, params);
      }
}
