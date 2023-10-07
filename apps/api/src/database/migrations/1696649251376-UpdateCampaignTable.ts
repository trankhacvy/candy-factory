import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCampaignTable1696649251376 implements MigrationInterface {
    name = 'UpdateCampaignTable1696649251376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign" ADD "numOfNft" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD "mintedNft" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "campaign_transaction" DROP CONSTRAINT "FK_8b09db3f2a92dfb3006dcca57b6"`);
        await queryRunner.query(`ALTER TABLE "campaign_transaction" ALTER COLUMN "campaign_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_transaction" ADD CONSTRAINT "FK_8b09db3f2a92dfb3006dcca57b6" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign_transaction" DROP CONSTRAINT "FK_8b09db3f2a92dfb3006dcca57b6"`);
        await queryRunner.query(`ALTER TABLE "campaign_transaction" ALTER COLUMN "campaign_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_transaction" ADD CONSTRAINT "FK_8b09db3f2a92dfb3006dcca57b6" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP COLUMN "mintedNft"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP COLUMN "numOfNft"`);
    }

}
