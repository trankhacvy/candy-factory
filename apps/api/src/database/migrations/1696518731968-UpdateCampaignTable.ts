import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCampaignTable1696518731968 implements MigrationInterface {
    name = 'UpdateCampaignTable1696518731968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_9fe77978fc1aff6b180cfce5e77" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_9fe77978fc1aff6b180cfce5e77"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP COLUMN "user_id"`);
    }

}
