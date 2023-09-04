import { PrismaService } from "../../src/prisma/prisma.service"
import * as bcrypt from "bcrypt" 

export class UsersFactory {
    private email: string
    private password: string
    private SALT=10

    constructor(private readonly prisma: PrismaService) { }

    withEmail(email: string){
        this.email = email
        return this
    }

    withPassword(password:string){
        this.password = password
        return this
    }

    build(){
        return {
            email: this.email,
            password: bcrypt.hashSync(this.password, this.SALT)
        }
    }


    async persist(){
        const user = this.build()
        return await this.prisma.users.create({
            data: user
        })
    }
}