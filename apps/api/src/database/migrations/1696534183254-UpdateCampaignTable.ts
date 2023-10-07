import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCampaignTable1696534183254 implements MigrationInterface {
    name = 'UpdateCampaignTable1696534183254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."campaign_transaction_status_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "campaign_transaction" ADD "status" "public"."campaign_transaction_status_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`CREATE TYPE "public"."campaign_status_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD "status" "public"."campaign_status_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "campaign_transaction" ALTER COLUMN "nftAddress" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_transaction" ALTER COLUMN "signature" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign_transaction" ALTER COLUMN "signature" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_transaction" ALTER COLUMN "nftAddress" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."campaign_status_enum"`);
        await queryRunner.query(`ALTER TABLE "campaign_transaction" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."campaign_transaction_status_enum"`);
    }

}
