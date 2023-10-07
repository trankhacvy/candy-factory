import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1696128071729 implements MigrationInterface {
    name = 'UpdateUserTable1696128071729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e282acb94d2e3aec10f480e4f6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "provider"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socialId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hash"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "photoId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "wallet" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_5f6f511ea673346697a431de82a" UNIQUE ("wallet")`);
        await queryRunner.query(`ALTER TABLE "audience" DROP CONSTRAINT "FK_eab801ed268c20dd4348ec15899"`);
        await queryRunner.query(`ALTER TABLE "audience" ALTER COLUMN "group_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audience" ADD CONSTRAINT "FK_eab801ed268c20dd4348ec15899" FOREIGN KEY ("group_id") REFERENCES "audience_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audience" DROP CONSTRAINT "FK_eab801ed268c20dd4348ec15899"`);
        await queryRunner.query(`ALTER TABLE "audience" ALTER COLUMN "group_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audience" ADD CONSTRAINT "FK_eab801ed268c20dd4348ec15899" FOREIGN KEY ("group_id") REFERENCES "audience_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_5f6f511ea673346697a431de82a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "wallet"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "roleId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "photoId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "hash" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "socialId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "provider" character varying NOT NULL DEFAULT 'email'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_e282acb94d2e3aec10f480e4f6" ON "user" ("hash") `);
        await queryRunner.query(`CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
