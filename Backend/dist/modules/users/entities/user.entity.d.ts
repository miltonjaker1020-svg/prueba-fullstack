import { Favorite } from '../../favorites/entities/favorite.entity';
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    favorites: Favorite[];
    createdAt: Date;
    updatedAt: Date;
}
