import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGroupTable1698389181739 implements MigrationInterface {
    name = 'UpdateGroupTable1698389181739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."audience_group_status_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "audience_group" ADD "status" "public"."audience_group_status_enum" NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audience_group" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."audience_group_status_enum"`);
    }

}
