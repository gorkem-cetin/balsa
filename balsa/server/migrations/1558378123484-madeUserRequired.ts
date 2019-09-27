import {MigrationInterface, QueryRunner} from "typeorm";

export class madeUserRequired1558378123484 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "balsa_file" DROP CONSTRAINT "FK_1cca9bb9c0e4bf18fd55b833090"`);
        await queryRunner.query(`ALTER TABLE "balsa_file" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "balsa_file" ADD CONSTRAINT "FK_1cca9bb9c0e4bf18fd55b833090" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "balsa_file" DROP CONSTRAINT "FK_1cca9bb9c0e4bf18fd55b833090"`);
        await queryRunner.query(`ALTER TABLE "balsa_file" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "balsa_file" ADD CONSTRAINT "FK_1cca9bb9c0e4bf18fd55b833090" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
