import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { E2EUtils } from "./utils/e2e-utils";
import { UsersFactory } from "./factories/users.factory";
import { JwtService } from "@nestjs/jwt";
import { faker } from "@faker-js/faker";
import request from 'supertest'
import { CreateCredentialDto } from "../src/credentials/dto/create-credential.dto";
import { CredentialsFactory } from "./factories/credentials.factory";

describe('Credentials E2E Tests', () => {
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

    it('POST /credentials => should create a credential', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const credentialDto: CreateCredentialDto = new CreateCredentialDto({
            title: faker.company.name(),
            url: faker.internet.url(),
            user: faker.person.firstName(),
            password: faker.commerce.productDescription()
        })

        const response = await request(app.getHttpServer()).post('/credentials')
            .set('Authorization', `Bearer ${token}`)
            .send(credentialDto)
            .expect(HttpStatus.CREATED)

        const credentialsDB = await prisma.credentials.findMany()
        expect(credentialsDB).toHaveLength(1)
    })

    it('POST /credentials => should send Bad Request(401) if has some empty body field in a credential', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const credentialDto: CreateCredentialDto = new CreateCredentialDto({
            title: faker.company.name(),
            url: faker.internet.url(),
            user: faker.person.firstName(),
        })

        const response = await request(app.getHttpServer()).post('/credentials')
            .set('Authorization', `Bearer ${token}`)
            .send(credentialDto)
            .expect(HttpStatus.BAD_REQUEST)

        const credentialsDB = await prisma.credentials.findMany()
        expect(credentialsDB).toHaveLength(0)
    })

    it('GET /credentials => should get all credentials from the user', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const newCredential = await new CredentialsFactory(prisma)
            .withTitle(faker.company.name())
            .withUrl(faker.internet.url())
            .withUser(faker.person.firstName())
            .withPassword(faker.commerce.productDescription())
            .withUserId(user.id)
            .persist()

        const response = await request(app.getHttpServer()).get('/credentials')
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.OK)

        expect(response.body).toHaveLength(1)
        expect(response.body[0]).toEqual({
            id: newCredential.id,
            title: newCredential.title,
            url: newCredential.url,
            user: newCredential.user,
            password: expect.any(String),
            userId: newCredential.userId
        })
    })


    it('GET /credentials => should get Not Found (404) if user has no credenttials', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const response = await request(app.getHttpServer()).get('/credentials')
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.NOT_FOUND)
    })

    it('GET /credentials/:id => should get credential by its id from this user', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const newCredential = await new CredentialsFactory(prisma)
            .withTitle(faker.company.name())
            .withUrl(faker.internet.url())
            .withUser(faker.person.firstName())
            .withPassword(faker.commerce.productDescription())
            .withUserId(user.id)
            .persist()

        const response = await request(app.getHttpServer()).get(`/credentials/${newCredential.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.OK)

        expect(response.body).toEqual({
            id: newCredential.id,
            title: newCredential.title,
            url: newCredential.url,
            user: newCredential.user,
            password: expect.any(String),
            userId: newCredential.userId
        })
    })

    it('GET /credentials/:id => should get Forbidden (403) if credential is not from this user', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const user2 = await new UsersFactory(prisma)
            .withEmail("vivi@vivi.com")
            .withPassword("123Victor!!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const newCredential = await new CredentialsFactory(prisma)
            .withTitle(faker.company.name())
            .withUrl(faker.internet.url())
            .withUser(faker.person.firstName())
            .withPassword(faker.commerce.productDescription())
            .withUserId(user2.id)
            .persist()

        const response = await request(app.getHttpServer()).get(`/credentials/${newCredential.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.FORBIDDEN)
    })

    it('DELETE /credentials/:id => should delete credential by its id', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const newCredential = await new CredentialsFactory(prisma)
            .withTitle(faker.company.name())
            .withUrl(faker.internet.url())
            .withUser(faker.person.firstName())
            .withPassword(faker.commerce.productDescription())
            .withUserId(user.id)
            .persist()

        const response = await request(app.getHttpServer()).delete(`/credentials/${newCredential.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.OK)
    })

    it('DELETE /credentials/:id => should get Forbidden (403) if credential to be delete is not from this user', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const user2 = await new UsersFactory(prisma)
            .withEmail("vivi@vivi.com")
            .withPassword("123Victor!!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const newCredential = await new CredentialsFactory(prisma)
            .withTitle(faker.company.name())
            .withUrl(faker.internet.url())
            .withUser(faker.person.firstName())
            .withPassword(faker.commerce.productDescription())
            .withUserId(user2.id)
            .persist()

        const response = await request(app.getHttpServer()).delete(`/credentials/${newCredential.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.FORBIDDEN)
    })

})