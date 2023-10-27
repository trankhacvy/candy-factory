import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNFTTable1698111919259 implements MigrationInterface {
    name = 'UpdateNFTTable1698111919259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "collectionId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft" ADD "collectionId" integer`);
    }

}
