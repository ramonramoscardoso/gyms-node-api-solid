import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckinUseCase } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

describe('Validate Check-in Use Case', async () => {
    let checkInsRepository: InMemoryCheckInsRepository;
    let sut: ValidateCheckinUseCase;

    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckinUseCase(checkInsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to validate the check-in', async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'usser-01',
        });

        const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInsRepository.items[0].validated_at).toEqual(
            expect.any(Date)
        );
    });

    it('should not be able to validate an inexistent check-in', async () => {
        await expect(async () => {
            await sut.execute({ checkInId: 'not-valid' });
        }).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'usser-01',
        });

        const twentyOneMinutesInMs = 1000 * 60 * 21;

        vi.advanceTimersByTime(twentyOneMinutesInMs);

        await expect(async () => {
            await sut.execute({ checkInId: createdCheckIn.id });
        }).rejects.toBeInstanceOf(LateCheckInValidationError);
    });
});
