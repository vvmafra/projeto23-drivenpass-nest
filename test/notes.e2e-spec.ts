import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { E2EUtils } from "./utils/e2e-utils";
import { UsersFactory } from "./factories/users.factory";
import { JwtService } from "@nestjs/jwt";
import { CreateNotesDto } from "../src/notes/dto/create-notes.dto";
import { faker } from "@faker-js/faker";
import request from 'supertest'
import { NotesFactory } from "./factories/notes.factory";

describe('Notes E2E Tests', () => {
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

    it('POST /notes => should create a note', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const noteDto: CreateNotesDto = new CreateNotesDto({
            title: faker.company.name(),
            text: faker.company.name()
        })

        const response = await request(app.getHttpServer()).post('/notes')
            .set('Authorization', `Bearer ${token}`)
            .send(noteDto)
            .expect(HttpStatus.CREATED)

        const notesDB = await prisma.notes.findMany()
        expect(notesDB).toHaveLength(1)
    })

    it('POST /notes => should send Bad Request(401) if has no text/title in a note', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const noteDto: CreateNotesDto = new CreateNotesDto({
            title: faker.company.name()
        })

        const response = await request(app.getHttpServer()).post('/notes')
            .set('Authorization', `Bearer ${token}`)
            .send(noteDto)
            .expect(HttpStatus.BAD_REQUEST)

        const notesDB = await prisma.notes.findMany()
        expect(notesDB).toHaveLength(0)
    })

    it('GET /notes => should get all notes from the user', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const newNote = await new NotesFactory(prisma)
            .withTitle(faker.company.name())
            .withText(faker.company.name())
            .withUserId(user.id)
            .persist()

        const response = await request(app.getHttpServer()).get('/notes')
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.OK)

        expect(response.body).toHaveLength(1)
        expect(response.body[0]).toEqual({
            id: newNote.id,
            title: newNote.title,
            text: newNote.text,
            userId: user.id
        })
    })


    it('GET /notes => should get Not Found (404) if user has no notes', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const response = await request(app.getHttpServer()).get('/notes')
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.NOT_FOUND)
    })

    it('GET /notes/:id => should get note by its id from this user', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const newNote = await new NotesFactory(prisma)
            .withTitle(faker.company.name())
            .withText(faker.company.name())
            .withUserId(user.id)
            .persist()

        const response = await request(app.getHttpServer()).get(`/notes/${newNote.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.OK)

        expect(response.body).toEqual({
            id: newNote.id,
            title: newNote.title,
            text: newNote.text,
            userId: user.id
        })
    })

    it('GET /notes/:id => should get Forbidden (403) if note is not from this user', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const user2 = await new UsersFactory(prisma)
            .withEmail("vivi@vivi.com")
            .withPassword("123Victor!!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const newNote = await new NotesFactory(prisma)
            .withTitle(faker.company.name())
            .withText(faker.company.name())
            .withUserId(user2.id)
            .persist()

        const response = await request(app.getHttpServer()).get(`/notes/${newNote.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.FORBIDDEN)
    })

    it('DELETE /notes/:id => should delete note by its id', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const newNote = await new NotesFactory(prisma)
            .withTitle(faker.company.name())
            .withText(faker.company.name())
            .withUserId(user.id)
            .persist()

        const response = await request(app.getHttpServer()).delete(`/notes/${newNote.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.OK)
    })

    it('DELETE /notes/:id => should get Forbidden (403) if note to be delete is not from this user', async () => {
        const user = await new UsersFactory(prisma)
            .withEmail("vi@vivi.com")
            .withPassword("123Victor!")
            .persist()

        const user2 = await new UsersFactory(prisma)
            .withEmail("vivi@vivi.com")
            .withPassword("123Victor!!")
            .persist()

        const token = await E2EUtils.createToken(jwt, user)

        const newNote = await new NotesFactory(prisma)
            .withTitle(faker.company.name())
            .withText(faker.company.name())
            .withUserId(user2.id)
            .persist()

        const response = await request(app.getHttpServer()).delete(`/notes/${newNote.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.FORBIDDEN)
    })

})