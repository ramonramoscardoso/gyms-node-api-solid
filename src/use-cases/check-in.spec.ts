import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckinUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';

describe('Check-in Use Case', async () => {
    let checkInsRepository: InMemoryCheckInsRepository;
    let gymsRepository: InMemoryGymsRepository;
    let sut: CheckinUseCase;

    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckinUseCase(checkInsRepository, gymsRepository);

        await gymsRepository.create({
            id: 'gym-01',
            title: 'Academia dos Testes',
            description: 'Just testing',
            latitude: -23.3767946,
            longitude: -46.6827211,
            phone: '',
        });

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.3767946,
            userLongitude: -46.6827211,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.3767946,
            userLongitude: -46.6827211,
        });

        await expect(async () => {
            await sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: -23.3767946,
                userLongitude: -46.6827211,
            });
        }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
    });

    it('should be able to check in twice in different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.3767946,
            userLongitude: -46.6827211,
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.3767946,
            userLongitude: -46.6827211,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in on distant gym', async () => {
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'Academia dos Testes 2',
            description: 'Just testing 2',
            latitude: new Decimal(-23.515359),
            longitude: new Decimal(-46.777432),
            phone: '',
        });

        await expect(async () => {
            await sut.execute({
                gymId: 'gym-02',
                userId: 'user-01',
                userLatitude: -23.3767946,
                userLongitude: -46.6827211,
            });
        }).rejects.toBeInstanceOf(MaxDistanceError);
    });
});
