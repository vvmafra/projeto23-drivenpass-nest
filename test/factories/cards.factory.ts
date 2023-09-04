import { CardType } from "@prisma/client"
import { PrismaService } from "../../src/prisma/prisma.service"
import Cryptr from "cryptr"

export class CardsFactory {
    private title: string
    private number: string
    private name: string
    private cvc: string
    private expirationDate: string
    private password: string
    private virtual: boolean
    private type: CardType
    private userId: number
    private cryptr: Cryptr

    constructor(private readonly prisma: PrismaService) {
        const Cryptr = require('cryptr');
        this.cryptr = new Cryptr('password')
        this.cryptr = new Cryptr('cvc')
    }

    withTitle(title: string) {
        this.title = title
        return this
    }

    withNumber(number: string) {
        this.number = number
        return this
    }

    withName(name: string) {
        this.name = name
        return this
    }

    withCvc(cvc: string) {
        this.cvc = cvc
        return this
    }

    withExpirationDate(expirationDate: string) {
        this.expirationDate = expirationDate
        return this
    }

    withPassword(password: string) {
        this.password = password
        return this
    }

    withVirtual(virtual: boolean) {
        this.virtual = virtual
        return this
    }

    withCardType(type: CardType) {
        this.type = type
        return this
    }

    withUserId(userId: number) {
        this.userId = userId
        return this
    }

    build() {
        return {
            title: this.title,
            number: this.number,
            name: this.name,
            cvc: this.cryptr.encrypt(this.cvc),
            expirationDate: this.expirationDate,
            virtual: this.virtual,
            type: this.type,
            password: this.cryptr.encrypt(this.password),
            userId: this.userId
        }
    }

    async persist() {
        const card = this.build()
        return await this.prisma.cards.create({
            data: card
        })
    }

}