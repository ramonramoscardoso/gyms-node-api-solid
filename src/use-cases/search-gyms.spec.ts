import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

describe('Search Gyms Use Case', async () => {
    let gymsRepository: InMemoryGymsRepository;
    let sut: SearchGymsUseCase;

    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsUseCase(gymsRepository);
    });

    it('should be able to search for gyms', async () => {
        await gymsRepository.create({
            title: 'Academia dos dev',
            description: null,
            phone: null,
            latitude: 0,
            longitude: 0,
        });

        await gymsRepository.create({
            title: 'Javascript Acad',
            description: null,
            phone: null,
            latitude: 0,
            longitude: 0,
        });

        const { gyms } = await sut.execute({
            query: 'dev',
            page: 1,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Academia dos dev' }),
        ]);
    });

    it('should be able to fetch paginated gym search', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Javascript Acad-${i}`,
                description: null,
                phone: null,
                latitude: 0,
                longitude: 0,
            });
        }

        const { gyms } = await sut.execute({
            query: 'Javascript',
            page: 2
        });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Javascript Acad-21' }),
            expect.objectContaining({ title: 'Javascript Acad-22' }),
        ]);
    });
});
