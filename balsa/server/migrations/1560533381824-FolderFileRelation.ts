import {MigrationInterface, QueryRunner} from "typeorm";

export class FolderFileRelation1560533381824 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "folder" ADD "fileId" integer`);
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "UQ_1f251a6da6dff3603e4303c0f41" UNIQUE ("fileId")`);
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "FK_1f251a6da6dff3603e4303c0f41" FOREIGN KEY ("fileId") REFERENCES "balsa_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "FK_1f251a6da6dff3603e4303c0f41"`);
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "UQ_1f251a6da6dff3603e4303c0f41"`);
        await queryRunner.query(`ALTER TABLE "folder" DROP COLUMN "fileId"`);
    }

}
