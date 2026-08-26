import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(currentUser: JwtPayload): Promise<UserResponseDto>;
    changePassword(currentUser: JwtPayload, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
