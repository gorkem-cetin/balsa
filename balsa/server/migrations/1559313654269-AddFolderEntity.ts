import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFolderEntity1559313654269 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "folder" DROP COLUMN "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "folder" ADD "description" character varying NOT NULL`);
    }

}
