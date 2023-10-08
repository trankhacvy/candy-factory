import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCampaignTable1696667105184 implements MigrationInterface {
    name = 'UpdateCampaignTable1696667105184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."drop_status_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TABLE "drop" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "status" "public"."drop_status_enum" NOT NULL DEFAULT '1', "nft_id" integer NOT NULL, "group_id" integer NOT NULL, "user_id" integer NOT NULL, "num_of_nft" integer DEFAULT '0', "minted_nft" integer DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_abaebd56a1515ba3b3f47c602fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."drop_transaction_status_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "drop_transaction" ("id" SERIAL NOT NULL, "nftAddress" character varying, "signature" character varying, "wallet" character varying NOT NULL, "status" "public"."drop_transaction_status_enum" NOT NULL DEFAULT '1', "drop_id" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2f609893217d3df96b068fad056" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "drop" ADD CONSTRAINT "FK_c7152329e4398c5fb74d3a4bb87" FOREIGN KEY ("nft_id") REFERENCES "nft"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "drop" ADD CONSTRAINT "FK_e4991d98b3632bfa450eebc4029" FOREIGN KEY ("group_id") REFERENCES "audience_group"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "drop" ADD CONSTRAINT "FK_1b5f416e9ca1ead7e5c2e10f145" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "drop_transaction" ADD CONSTRAINT "FK_35032e920547aa83654f2673fbe" FOREIGN KEY ("drop_id") REFERENCES "drop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drop_transaction" DROP CONSTRAINT "FK_35032e920547aa83654f2673fbe"`);
        await queryRunner.query(`ALTER TABLE "drop" DROP CONSTRAINT "FK_1b5f416e9ca1ead7e5c2e10f145"`);
        await queryRunner.query(`ALTER TABLE "drop" DROP CONSTRAINT "FK_e4991d98b3632bfa450eebc4029"`);
        await queryRunner.query(`ALTER TABLE "drop" DROP CONSTRAINT "FK_c7152329e4398c5fb74d3a4bb87"`);
        await queryRunner.query(`DROP TABLE "drop_transaction"`);
        await queryRunner.query(`DROP TYPE "public"."drop_transaction_status_enum"`);
        await queryRunner.query(`DROP TABLE "drop"`);
        await queryRunner.query(`DROP TYPE "public"."drop_status_enum"`);
    }

}
