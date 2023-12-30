import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { expect, describe, it, beforeEach } from 'vitest';
import { CreateGymUseCase } from './create-gym';

describe('Create Gym Use Case', () => {
    let gymsRepository: InMemoryGymsRepository;
    let sut: CreateGymUseCase;

    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new CreateGymUseCase(gymsRepository);
    });

    it('should be able to create gym', async () => {
        const { gym } = await sut.execute({
            title: 'Academia dos dev',
            latitude: -23.3767946,
            longitude: -46.6827211,
            phone: null,
            description: null,
        });

        expect(gym.id).toEqual(expect.any(String));
    });
});
