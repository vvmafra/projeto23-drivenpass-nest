import { CardType } from "@prisma/client";
import { IsBoolean, IsCreditCard, IsDate, IsDateString, IsEnum, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCardsDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    number: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    cvc: string

    @IsDateString()
    @IsNotEmpty()
    expirationDate: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsBoolean()
    @IsNotEmpty()
    virtual: boolean

    @IsEnum(CardType)
    @IsNotEmpty()
    type: CardType
}
