import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTransactionTable1697107940768 implements MigrationInterface {
    name = 'UpdateTransactionTable1697107940768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "amount" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "amount" integer NOT NULL`);
    }

}
