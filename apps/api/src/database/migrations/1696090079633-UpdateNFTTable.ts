import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNFTTable1696090079633 implements MigrationInterface {
    name = 'UpdateNFTTable1696090079633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft" ADD "externalUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "collectionExternalUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "nft" ALTER COLUMN "creator" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft" ALTER COLUMN "creator" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "collectionExternalUrl"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "externalUrl"`);
    }

}
