import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

describe('Fetch Nearby Gyms Use Case', async () => {
    let gymsRepository: InMemoryGymsRepository;
    let sut: FetchNearbyGymsUseCase;

    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsUseCase(gymsRepository);
    });

    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -23.51469,
            longitude: -46.7600084,
        });

        await gymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: -21.725917,
            longitude: -45.4905726,
        });

        const { gyms } = await sut.execute({
            userLatitude: -23.51469,
            userLongitude: -46.7600084,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym' }),
        ]);
    });
});
