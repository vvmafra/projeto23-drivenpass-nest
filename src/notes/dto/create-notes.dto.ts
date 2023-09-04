import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotesDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
      example: "Cake Recipe",
      description: "Title for a note"
    })
    title: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
      example: "1 egg, 1 glass of chocolate powder...",
      description: "Text for a note"
    })
    text: string

    constructor(params?: Partial<CreateNotesDto>) {
        if (params) Object.assign(this, params);
      }
}
