import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../src/prisma/prisma.service";
import { Users } from "@prisma/client";

export class E2EUtils {
  static async cleanDb(prisma: PrismaService) {
    await prisma.cards.deleteMany();
    await prisma.credentials.deleteMany();
    await prisma.notes.deleteMany();
    await prisma.users.deleteMany();
  }

  static async createToken(jwtService: JwtService, user: Users) {
    const { email, id } = user
    const token = jwtService.sign({ email, id }, {
      expiresIn: "10 days",
      subject: String(id),
      issuer: "Victor",
      audience: "users"
    })

    return token
  }
}