import { UserRole } from '../entities/user.entity';
export declare class UserResponseDto {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}
