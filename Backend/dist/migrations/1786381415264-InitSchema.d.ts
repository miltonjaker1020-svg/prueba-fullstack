import { MigrationInterface, QueryRunner } from "typeorm";
export declare class InitSchema1786381415264 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
