import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../src/prisma/prisma.service"
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { E2EUtils } from "./utils/e2e-utils"
import { SignInDto } from "../src/auth/dto/signin.dto"
import { faker } from '@faker-js/faker';
import { SignUpDto } from "../src/auth/dto/signup.dto"
import request from 'supertest'
import * as bcrypt from 'bcrypt';
import { UsersFactory } from "./factories/users.factory"
import { CardsFactory } from "./factories/cards.factory"
import { JwtService } from "@nestjs/jwt"
import { CredentialsFactory } from "./factories/credentials.factory"
import { NotesFactory } from "./factories/notes.factory"



describe('Users E2E Tests', () => {
    let app: INestApplication
    let prisma: PrismaService = new PrismaService
    let jwt: JwtService = new JwtService({ secret: process.env.JWT_SECRET })

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue(prisma)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe())
        await app.init();

        await E2EUtils.cleanDb(prisma);
    });

    afterAll(async () => {
        await app.close()
        await prisma.$disconnect()
    })

    it('SIGN-UP /auth => should create a new user', async () => {
        const signUpDto: SignUpDto = new SignUpDto({
            email: faker.internet.email(),
            password: "123Victor!"
        })

        await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send(signUpDto)
            .expect(HttpStatus.CREATED)

        const users = await prisma.users.findMany()
        expect(users).toHaveLength(1)
        const user = users[0]

        const checkPassword = await bcrypt.compare(signUpDto.password, user.password)
        expect(user.email).toBe(signUpDto.email)
        expect(checkPassword).toBe(true)

    })

    it('SIGN-UP /auth => should not create if user with this email already exists', async () => {
        await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const signUpDto: SignUpDto = new SignUpDto({
            email: "vi@vivi.com",
            password: "123Victor!"
        })

        await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send(signUpDto)
            .expect(HttpStatus.CONFLICT)
    })

    it('SIGN-UP /auth => should not create if password is not strong enough', async () => {

        const signUpDto: SignUpDto = new SignUpDto({
            email: "vi@vivi.com",
            password: "123"
        })

        await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send(signUpDto)
            .expect(HttpStatus.BAD_REQUEST)

        const users = await prisma.users.findMany()
        expect(users).toHaveLength(0)
    })

    it('SIGN-IN /auth => should login and generate token when login', async () => {
        await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const signInDto: SignUpDto = new SignUpDto({
            email: "vi@vivi.com",
            password: "123Victor!"
        })

        const response = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send(signInDto)
        expect(response.status).toBe(HttpStatus.OK)
        expect(response.body).toEqual({
            token: expect.any(String)
        })
    })

    it('SIGN-IN /auth => should get Unathorized (401) when email or passwords does not match with any in the database', async () => {
        await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const signInDto: SignUpDto = new SignUpDto({
            email: "vi@gmail.com",
            password: "123456789Nice!"
        })

        const response = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send(signInDto)
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    })

    it('DELETE /erase => should erase all cards, notes, credentials and user account', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const newCard = await new CardsFactory(prisma)
            .withTitle(faker.company.name())
            .withNumber(faker.finance.creditCardNumber())
            .withName(faker.person.firstName())
            .withCvc(faker.finance.creditCardCVV())
            .withExpirationDate("2023-12-31T23:59:59.999Z")
            .withPassword(faker.commerce.productDescription())
            .withVirtual(faker.datatype.boolean())
            .withCardType("credit_card")
            .withUserId(user.id)
            .persist()

        const newCredential = await new CredentialsFactory(prisma)
            .withTitle(faker.company.name())
            .withUrl(faker.internet.url())
            .withUser(faker.person.firstName())
            .withPassword(faker.commerce.productDescription())
            .withUserId(user.id)
            .persist()

        const newNote = await new NotesFactory(prisma)
            .withTitle(faker.company.name())
            .withText(faker.company.name())
            .withUserId(user.id)
            .persist()

        const response = await request(app.getHttpServer()).delete(`/erase`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: "vi@vivi.com",
                password: "123Victor!"
            })
            .expect(HttpStatus.OK)

        const notesDB = await prisma.notes.findMany()
        expect(notesDB).toHaveLength(0)

        const credentialsDB = await prisma.credentials.findMany()
        expect(credentialsDB).toHaveLength(0)

        const cardsDB = await prisma.cards.findMany()
        expect(cardsDB).toHaveLength(0)

        const usersDB = await prisma.users.findMany()
        expect(usersDB).toHaveLength(0)
    })

    it('DELETE /erase => should get Unathorized (401) if you try to erase all cards, notes, credentials and user account with a wrong email/password', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const newCard = await new CardsFactory(prisma)
            .withTitle(faker.company.name())
            .withNumber(faker.finance.creditCardNumber())
            .withName(faker.person.firstName())
            .withCvc(faker.finance.creditCardCVV())
            .withExpirationDate("2023-12-31T23:59:59.999Z")
            .withPassword(faker.commerce.productDescription())
            .withVirtual(faker.datatype.boolean())
            .withCardType("credit_card")
            .withUserId(user.id)
            .persist()

        const newCredential = await new CredentialsFactory(prisma)
            .withTitle(faker.company.name())
            .withUrl(faker.internet.url())
            .withUser(faker.person.firstName())
            .withPassword(faker.commerce.productDescription())
            .withUserId(user.id)
            .persist()

        const newNote = await new NotesFactory(prisma)
            .withTitle(faker.company.name())
            .withText(faker.company.name())
            .withUserId(user.id)
            .persist()

        const response = await request(app.getHttpServer()).delete(`/erase`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: faker.internet.email(),
                password: "123Victor!"
            })
            .expect(HttpStatus.UNAUTHORIZED)

        const notesDB = await prisma.notes.findMany()
        expect(notesDB).toHaveLength(1)

        const credentialsDB = await prisma.credentials.findMany()
        expect(credentialsDB).toHaveLength(1)

        const cardsDB = await prisma.cards.findMany()
        expect(cardsDB).toHaveLength(1)

        const usersDB = await prisma.users.findMany()
        expect(usersDB).toHaveLength(1)
    })
})