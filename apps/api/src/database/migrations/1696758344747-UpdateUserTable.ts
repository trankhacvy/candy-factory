import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1696758344747 implements MigrationInterface {
    name = 'UpdateUserTable1696758344747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "init" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "init"`);
    }

}
