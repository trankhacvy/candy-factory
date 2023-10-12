import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDropTable1697022351196 implements MigrationInterface {
    name = 'UpdateDropTable1697022351196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drop" ADD "wallets_source" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "drop" ADD "collection" character varying`);
        await queryRunner.query(`ALTER TABLE "drop" DROP CONSTRAINT "FK_e4991d98b3632bfa450eebc4029"`);
        await queryRunner.query(`ALTER TABLE "drop" ALTER COLUMN "group_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drop" ADD CONSTRAINT "FK_e4991d98b3632bfa450eebc4029" FOREIGN KEY ("group_id") REFERENCES "audience_group"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drop" DROP CONSTRAINT "FK_e4991d98b3632bfa450eebc4029"`);
        await queryRunner.query(`ALTER TABLE "drop" ALTER COLUMN "group_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drop" ADD CONSTRAINT "FK_e4991d98b3632bfa450eebc4029" FOREIGN KEY ("group_id") REFERENCES "audience_group"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "drop" DROP COLUMN "collection"`);
        await queryRunner.query(`ALTER TABLE "drop" DROP COLUMN "wallets_source"`);
    }

}
