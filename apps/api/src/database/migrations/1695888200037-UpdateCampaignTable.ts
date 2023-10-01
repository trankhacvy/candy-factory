import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCampaignTable1695888200037 implements MigrationInterface {
    name = 'UpdateCampaignTable1695888200037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "campaign_transaction" ("id" SERIAL NOT NULL, "nftAddress" character varying NOT NULL, "signature" character varying NOT NULL, "wallet" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "campaign_id" integer, CONSTRAINT "PK_0a895c4908ed2f119150b0d5df8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "campaign_id" integer`);
        await queryRunner.query(`ALTER TABLE "nft" ADD CONSTRAINT "UQ_7ea394acde6700a8b51e0940bc1" UNIQUE ("campaign_id")`);
        await queryRunner.query(`ALTER TABLE "audience_group" ADD "campaign_id" integer`);
        await queryRunner.query(`ALTER TABLE "audience_group" ADD CONSTRAINT "UQ_866aeb625e583fee3be1ac4c7e9" UNIQUE ("campaign_id")`);
        await queryRunner.query(`ALTER TABLE "nft" ADD CONSTRAINT "FK_7ea394acde6700a8b51e0940bc1" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "campaign_transaction" ADD CONSTRAINT "FK_8b09db3f2a92dfb3006dcca57b6" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audience_group" ADD CONSTRAINT "FK_866aeb625e583fee3be1ac4c7e9" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audience_group" DROP CONSTRAINT "FK_866aeb625e583fee3be1ac4c7e9"`);
        await queryRunner.query(`ALTER TABLE "campaign_transaction" DROP CONSTRAINT "FK_8b09db3f2a92dfb3006dcca57b6"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP CONSTRAINT "FK_7ea394acde6700a8b51e0940bc1"`);
        await queryRunner.query(`ALTER TABLE "audience_group" DROP CONSTRAINT "UQ_866aeb625e583fee3be1ac4c7e9"`);
        await queryRunner.query(`ALTER TABLE "audience_group" DROP COLUMN "campaign_id"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP CONSTRAINT "UQ_7ea394acde6700a8b51e0940bc1"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "campaign_id"`);
        await queryRunner.query(`DROP TABLE "campaign_transaction"`);
    }

}
