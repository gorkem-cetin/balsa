import {MigrationInterface, QueryRunner} from "typeorm";

export class addContentField1558376637162 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "balsa_file" ADD "content" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "balsa_file" DROP COLUMN "content"`);
    }

}
