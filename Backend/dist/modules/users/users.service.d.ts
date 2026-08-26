import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User>;
    create(name: string, email: string, password: string): Promise<User>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    toResponse(user: User): UserResponseDto;
}
