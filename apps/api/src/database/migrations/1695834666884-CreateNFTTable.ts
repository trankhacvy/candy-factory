import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNFTTable1695834666884 implements MigrationInterface {
    name = 'CreateNFTTable1695834666884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nft" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "symbol" character varying NOT NULL, "image" character varying NOT NULL, "metadataUri" character varying NOT NULL, "attributes" jsonb NOT NULL DEFAULT '[]', "creator" character varying NOT NULL, "collectionName" character varying, "collectionDescription" character varying, "collectionSymbol" character varying, "collectionImage" character varying, "collectionMetadataUri" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_8f46897c58e23b0e7bf6c8e56b0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "nft"`);
    }

}
