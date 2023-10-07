import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCampaignTable1696645933325 implements MigrationInterface {
    name = 'UpdateCampaignTable1696645933325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audience_group" DROP CONSTRAINT "FK_866aeb625e583fee3be1ac4c7e9"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP CONSTRAINT "FK_7ea394acde6700a8b51e0940bc1"`);
        await queryRunner.query(`ALTER TABLE "audience_group" DROP CONSTRAINT "UQ_866aeb625e583fee3be1ac4c7e9"`);
        await queryRunner.query(`ALTER TABLE "audience_group" DROP COLUMN "campaign_id"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP CONSTRAINT "UQ_7ea394acde6700a8b51e0940bc1"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "campaign_id"`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD "nft_id" integer`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "UQ_f06a02bccfcf9d7970f73e7d111" UNIQUE ("nft_id")`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD "group_id" integer`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "UQ_c8e847a8b713cc56ec13d8a3b8b" UNIQUE ("group_id")`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_f06a02bccfcf9d7970f73e7d111" FOREIGN KEY ("nft_id") REFERENCES "nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_c8e847a8b713cc56ec13d8a3b8b" FOREIGN KEY ("group_id") REFERENCES "audience_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_c8e847a8b713cc56ec13d8a3b8b"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_f06a02bccfcf9d7970f73e7d111"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "UQ_c8e847a8b713cc56ec13d8a3b8b"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP COLUMN "group_id"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "UQ_f06a02bccfcf9d7970f73e7d111"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP COLUMN "nft_id"`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "campaign_id" integer`);
        await queryRunner.query(`ALTER TABLE "nft" ADD CONSTRAINT "UQ_7ea394acde6700a8b51e0940bc1" UNIQUE ("campaign_id")`);
        await queryRunner.query(`ALTER TABLE "audience_group" ADD "campaign_id" integer`);
        await queryRunner.query(`ALTER TABLE "audience_group" ADD CONSTRAINT "UQ_866aeb625e583fee3be1ac4c7e9" UNIQUE ("campaign_id")`);
        await queryRunner.query(`ALTER TABLE "nft" ADD CONSTRAINT "FK_7ea394acde6700a8b51e0940bc1" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audience_group" ADD CONSTRAINT "FK_866aeb625e583fee3be1ac4c7e9" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
