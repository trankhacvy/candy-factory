import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNFTTable1696357535825 implements MigrationInterface {
    name = 'UpdateNFTTable1696357535825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nft" ADD CONSTRAINT "FK_5c9c2fd34e6b1ed340e8cb3e0c9" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft" DROP CONSTRAINT "FK_5c9c2fd34e6b1ed340e8cb3e0c9"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "user_id"`);
    }

}
