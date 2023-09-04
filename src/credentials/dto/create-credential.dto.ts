import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCredentialDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsUrl()
    @IsNotEmpty()
    url: string

    @IsString()
    @IsNotEmpty()
    user: string

    @IsString()
    @IsNotEmpty()
    password: string

    constructor(params?: Partial<CreateCredentialDto>) {
        if (params) Object.assign(this, params);
      }
}
