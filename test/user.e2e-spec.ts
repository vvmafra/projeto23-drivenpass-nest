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



describe('Users E2E Tests', () => {
    let app: INestApplication
    let prisma: PrismaService = new PrismaService

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
})