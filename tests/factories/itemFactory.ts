import { faker } from '@faker-js/faker';

export function itemFactory(){
    return{
        title: faker.commerce.product(),
        url: faker.internet.avatar(),
        description: faker.commerce.productDescription(),
        amount: Number(faker.commerce.price())
    }
}