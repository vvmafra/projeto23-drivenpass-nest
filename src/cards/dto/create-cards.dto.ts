import { ApiProperty } from "@nestjs/swagger";
import { CardType } from "@prisma/client";
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateCardsDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "MasterCard Chuck",
        description: "Title for card"
      })
    title: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "1234123412341234",
        description: "Card's number"
      })
    number: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "Chuck V Chuck",
        description: "Name in the card"
      })
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "0922",
        description: "Card's security number, usually on its back"
      })
    cvc: string

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({
        example: "2023-12-31T23:59:59.999Z",
        description: "Card's expiration date"
      })
    expirationDate: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "145623",
        description: "Card's passwords"
      })
    password: string

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({
        example: "true",
        description: "If the card is virtual"
      })
    virtual: boolean

    @IsEnum(CardType)
    @IsNotEmpty()
    @ApiProperty({
        example: "credit_card",
        description: "If the card is credit, debit or both"
      })
    type: CardType

    constructor(params?: Partial<CreateCardsDto>) {
        if (params) Object.assign(this, params);
    }
}
