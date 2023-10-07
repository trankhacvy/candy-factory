import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCampaignTable1696591197193 implements MigrationInterface {
    name = 'UpdateCampaignTable1696591197193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft" DROP CONSTRAINT "FK_7ea394acde6700a8b51e0940bc1"`);
        await queryRunner.query(`ALTER TABLE "audience_group" DROP CONSTRAINT "FK_866aeb625e583fee3be1ac4c7e9"`);
        await queryRunner.query(`ALTER TABLE "nft" ADD CONSTRAINT "FK_7ea394acde6700a8b51e0940bc1" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audience_group" ADD CONSTRAINT "FK_866aeb625e583fee3be1ac4c7e9" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audience_group" DROP CONSTRAINT "FK_866aeb625e583fee3be1ac4c7e9"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP CONSTRAINT "FK_7ea394acde6700a8b51e0940bc1"`);
        await queryRunner.query(`ALTER TABLE "audience_group" ADD CONSTRAINT "FK_866aeb625e583fee3be1ac4c7e9" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "nft" ADD CONSTRAINT "FK_7ea394acde6700a8b51e0940bc1" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
