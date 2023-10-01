import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAudienceGroupTable1695841090249 implements MigrationInterface {
    name = 'CreateAudienceGroupTable1695841090249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audience_group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "numOfAudience" integer DEFAULT '0', "isFavorite" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_eab801ed268c20dd4348ec15899" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_785fc2aac4c77fdfd274e0fecf" ON "audience_group" ("name") `);
        await queryRunner.query(`ALTER TABLE "audience" ADD "group_id" integer`);
        await queryRunner.query(`ALTER TABLE "audience" ADD CONSTRAINT "FK_eab801ed268c20dd4348ec15899" FOREIGN KEY ("group_id") REFERENCES "audience_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audience" DROP CONSTRAINT "FK_eab801ed268c20dd4348ec15899"`);
        await queryRunner.query(`ALTER TABLE "audience" DROP COLUMN "group_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_785fc2aac4c77fdfd274e0fecf"`);
        await queryRunner.query(`DROP TABLE "audience_group"`);
    }

}
