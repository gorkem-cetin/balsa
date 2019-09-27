import {MigrationInterface, QueryRunner} from "typeorm";

export class Created1558374754229 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "balsa_file" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_2eb234e17d5be0f332bf5decde6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "balsa_file" ADD CONSTRAINT "FK_1cca9bb9c0e4bf18fd55b833090" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "balsa_file" DROP CONSTRAINT "FK_1cca9bb9c0e4bf18fd55b833090"`);
        await queryRunner.query(`DROP TABLE "balsa_file"`);
    }

}
