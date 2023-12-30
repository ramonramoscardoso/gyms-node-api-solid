import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Nearby Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to list nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Academia dos dev',
                description: 'descricao',
                phone: '0000000000',
                latitude: -23.3767946,
                longitude: -46.6827211,
            });

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Academia do Typescript',
                description: 'descricao',
                phone: '0000000000',
                latitude: -20.5289538,
                longitude: -47.4006521,
            });

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -23.3767946,
                longitude: -46.6827211,
            })
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({ title: 'Academia dos dev' }),
        ]);
    });
});
