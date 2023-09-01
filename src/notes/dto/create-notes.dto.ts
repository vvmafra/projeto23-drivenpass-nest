import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotesDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    text: string
}
