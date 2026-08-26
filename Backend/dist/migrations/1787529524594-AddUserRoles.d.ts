import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddUserRoles1787529524594 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
