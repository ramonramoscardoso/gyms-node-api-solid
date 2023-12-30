import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { CheckinUseCase } from '../check-in';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeCheckInUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository();
    const gymsRepository = new PrismaGymsRepository();

    return new CheckinUseCase(checkInsRepository, gymsRepository);
}
