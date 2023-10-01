import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAudienceTable1695828921140 implements MigrationInterface {
    name = 'CreateAudienceTable1695828921140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audience" ("id" SERIAL NOT NULL, "wallet" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2ecf18dc010ddf7e956afd9866b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_72ac2341eddaf0c83d4c01b33e" ON "audience" ("wallet") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_72ac2341eddaf0c83d4c01b33e"`);
        await queryRunner.query(`DROP TABLE "audience"`);
    }

}
