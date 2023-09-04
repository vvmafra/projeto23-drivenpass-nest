import Cryptr from "cryptr"
import { PrismaService } from "../../src/prisma/prisma.service"

export class CredentialsFactory {
    private title: string
    private url: string
    private user: string
    private password: string
    private userId: number
    private cryptr: Cryptr

    constructor(private readonly prisma: PrismaService) {
        const Cryptr = require('cryptr');
        this.cryptr = new Cryptr('password')
    }

    withTitle(title: string) {
        this.title = title
        return this
    }

    withUrl(url: string) {
        this.url = url
        return this
    }

    withUser(user: string) {
        this.user = user
        return this
    }

    withPassword(password: string) {
        this.password = password
        return this
    }

    withUserId(userId: number) {
        this.userId = userId
        return this
    }

    build() {
        return {
            title: this.title,
            url: this.url,
            user: this.user,
            password: this.cryptr.encrypt(this.password),
            userId: this.userId
        }
    }

    async persist() {
        const credential = this.build()
        return await this.prisma.credentials.create({
            data: credential
        })
    }

}