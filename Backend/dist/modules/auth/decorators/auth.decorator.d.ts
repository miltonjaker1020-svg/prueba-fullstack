import { UserRole } from '../../users/entities/user.entity';
export declare function Auth(...roles: UserRole[]): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
