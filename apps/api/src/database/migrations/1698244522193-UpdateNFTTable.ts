import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNFTTable1698244522193 implements MigrationInterface {
    name = 'UpdateNFTTable1698244522193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft" ADD "royalty" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "creators"`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "creators" jsonb NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "creators"`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "creators" character varying`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "royalty"`);
    }

}
