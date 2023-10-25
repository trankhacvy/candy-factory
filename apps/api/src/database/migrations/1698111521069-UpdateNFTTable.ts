import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNFTTable1698111521069 implements MigrationInterface {
    name = 'UpdateNFTTable1698111521069'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audience" DROP CONSTRAINT "FK_eab801ed268c20dd4348ec15899"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "creator"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "collectionName"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "collectionDescription"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "collectionSymbol"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "collectionImage"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "collectionMetadataUri"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "collectionExternalUrl"`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "is_collection" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "creators" character varying`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "collectionId" integer`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "nft_address" character varying`);
        await queryRunner.query(`ALTER TABLE "nft" ADD CONSTRAINT "UQ_3073c9c1b78aa176cddb4d9de5d" UNIQUE ("nft_address")`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "collectionKeys" jsonb DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "collection_id" integer`);
        await queryRunner.query(`ALTER TABLE "audience" ADD CONSTRAINT "FK_eab801ed268c20dd4348ec15899" FOREIGN KEY ("group_id") REFERENCES "audience_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nft" ADD CONSTRAINT "FK_ffe58aa05707db77c2f20ecdbc3" FOREIGN KEY ("collection_id") REFERENCES "nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft" DROP CONSTRAINT "FK_ffe58aa05707db77c2f20ecdbc3"`);
        await queryRunner.query(`ALTER TABLE "audience" DROP CONSTRAINT "FK_eab801ed268c20dd4348ec15899"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "collection_id"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "collectionKeys"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP CONSTRAINT "UQ_3073c9c1b78aa176cddb4d9de5d"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "nft_address"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "collectionId"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "creators"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "is_collection"`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "collectionExternalUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "collectionMetadataUri" character varying`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "collectionImage" character varying`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "collectionSymbol" character varying`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "collectionDescription" character varying`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "collectionName" character varying`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "creator" character varying`);
        await queryRunner.query(`ALTER TABLE "audience" ADD CONSTRAINT "FK_eab801ed268c20dd4348ec15899" FOREIGN KEY ("group_id") REFERENCES "audience_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
