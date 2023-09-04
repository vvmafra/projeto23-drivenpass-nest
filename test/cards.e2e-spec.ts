import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { E2EUtils } from "./utils/e2e-utils";
import { UsersFactory } from "./factories/users.factory";
import { JwtService } from "@nestjs/jwt";
import { faker } from "@faker-js/faker";
import request from 'supertest'
import { CreateCardsDto } from "../src/cards/dto/create-cards.dto";
import { CardsFactory } from "./factories/cards.factory";

describe('Cards E2E Tests', () => {
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

    it('POST /cards => should create a card', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const cardDto: CreateCardsDto = new CreateCardsDto({
            title: faker.company.name(),
            number: faker.finance.creditCardNumber(),
            name: faker.person.firstName(),
            cvc: faker.finance.creditCardCVV(),
            expirationDate: "2023-12-31T23:59:59.999Z",
            password: faker.commerce.productDescription(),
            virtual: faker.datatype.boolean(),
            type: "credit_card"
        })

        const response = await request(app.getHttpServer()).post('/cards')
            .set('Authorization', `Bearer ${token}`)
            .send(cardDto)
            .expect(HttpStatus.CREATED)

        const cardsDB = await prisma.cards.findMany()
        expect(cardsDB).toHaveLength(1)
    })

    it('POST /cards => should send Bad Request(401) if has some empty body field in a card', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const cardDto: CreateCardsDto = new CreateCardsDto({
            title: faker.company.name(),
            number: faker.finance.creditCardNumber(),
            name: faker.person.firstName(),
            cvc: faker.finance.creditCardCVV(),
            expirationDate: "2023-12-31T23:59:59.999Z",
            virtual: faker.datatype.boolean(),
            type: "credit_card"
        })

        const response = await request(app.getHttpServer()).post('/cards')
            .set('Authorization', `Bearer ${token}`)
            .send(cardDto)
            .expect(HttpStatus.BAD_REQUEST)

        const cardsDB = await prisma.cards.findMany()
        expect(cardsDB).toHaveLength(0)
    })

    it('GET /cards => should get all cards from the user', async () => {
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

        const response = await request(app.getHttpServer()).get('/cards')
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.OK)

        expect(response.body).toHaveLength(1)
        expect(response.body[0]).toEqual({
            id: newCard.id,
            title: newCard.title,
            number: newCard.number,
            name: newCard.name,
            cvc: expect.any(String),
            expirationDate: "2023-12-31T23:59:59.999Z",
            password: expect.any(String),
            virtual: newCard.virtual,
            type: newCard.type,
            userId: newCard.userId
        })
    })


    it('GET /cards => should get Not Found (404) if user has no cards', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const response = await request(app.getHttpServer()).get('/cards')
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.NOT_FOUND)
    })

    it('GET /cards/:id => should get card by its id from this user', async () => {
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

        const response = await request(app.getHttpServer()).get(`/cards/${newCard.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.OK)

        expect(response.body).toEqual({
            id: newCard.id,
            title: newCard.title,
            number: newCard.number,
            name: newCard.name,
            cvc: expect.any(String),
            expirationDate: "2023-12-31T23:59:59.999Z",
            password: expect.any(String),
            virtual: newCard.virtual,
            type: newCard.type,
            userId: newCard.userId
        })
    })

    it('GET /cards/:id => should get Forbidden (403) if card is not from this user', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const user2 = await new UsersFactory(prisma)
            .withEmail("vivi@vivi.com")
            .withPassword("123Victor!!")
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
            .withUserId(user2.id)
            .persist()

        const response = await request(app.getHttpServer()).get(`/cards/${newCard.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.FORBIDDEN)
    })

    it('DELETE /cards/:id => should delete card by its id', async () => {
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

        const response = await request(app.getHttpServer()).delete(`/cards/${newCard.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.OK)
    })

    it('DELETE /cards/:id => should get Forbidden (403) if card to be delete is not from this user', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const user2 = await new UsersFactory(prisma)
            .withEmail("vivi@vivi.com")
            .withPassword("123Victor!!")
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
            .withUserId(user2.id)
            .persist()

        const response = await request(app.getHttpServer()).delete(`/cards/${newCard.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.FORBIDDEN)
    })

})