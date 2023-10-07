import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAudienceGroupTable1696359480327 implements MigrationInterface {
    name = 'UpdateAudienceGroupTable1696359480327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audience_group" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audience_group" ADD CONSTRAINT "FK_bdcd8a630072d3b9695deddabef" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audience_group" DROP CONSTRAINT "FK_bdcd8a630072d3b9695deddabef"`);
        await queryRunner.query(`ALTER TABLE "audience_group" DROP COLUMN "user_id"`);
    }

}
