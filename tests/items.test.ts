import supertest from 'supertest';
import app from '../src/app';
import { itemFactory } from './factories/itemFactory';
import { prisma } from '../src/database';

beforeEach(async()=>{
  await prisma.$executeRaw`TRUNCATE TABLE items RESTART IDENTITY`;
})

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async()=>{

    const result = await supertest(app).post('/items').send(itemFactory());
    
    expect(result.status).toBe(201);
  });

  it('Deve retornar 409, ao tentar cadastrar um item que exista', async()=>{
    const item = itemFactory();

    await supertest(app).post('/items').send(item);

    const result = await supertest(app).post('/items').send(item);

    expect(result.status).toBe(409);

  } );
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async()=>{
    await supertest(app).post('/items').send(itemFactory());
    
    const result = await supertest(app).get('/items');

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);

  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async()=>{
    const item = itemFactory();
    
    await supertest(app).post('/items').send(item);

    const result = await supertest(app).get('/items/1');

    expect(result.status).toBe(200);
    delete result.body.id;
    expect(result.body).toEqual(item);

  });
  it('Deve retornar status 404 caso não exista um item com esse id', async()=>{
    const result = await supertest(app).get('/items/1');

    expect(result.status).toBe(404);
  });
});

afterAll(async()=>{
  await prisma.$executeRaw`TRUNCATE TABLE items RESTART IDENTITY`;
  await prisma.$disconnect();
})