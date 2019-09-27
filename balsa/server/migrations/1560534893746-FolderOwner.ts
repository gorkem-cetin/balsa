import {MigrationInterface, QueryRunner} from "typeorm";

export class FolderOwner1560534893746 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "folder" ADD "ownerId" integer`);
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "UQ_e09b8e7d4818dd263dde45bbecb" UNIQUE ("ownerId")`);
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "FK_e09b8e7d4818dd263dde45bbecb" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "FK_e09b8e7d4818dd263dde45bbecb"`);
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "UQ_e09b8e7d4818dd263dde45bbecb"`);
        await queryRunner.query(`ALTER TABLE "folder" DROP COLUMN "ownerId"`);
    }

}
