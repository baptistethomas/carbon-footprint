import { MigrationInterface, QueryRunner } from "typeorm";

export class CarbonFootprintRecipe1713800910616 implements MigrationInterface {
    name = 'CarbonFootprintRecipe1713800910616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "carbon_footprint_recipes" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "carbonFootprint" double precision, CONSTRAINT "UQ_14589a53a1125c425d6b904f9e0" UNIQUE ("name"), CONSTRAINT "PK_335da2e210621f2234f15b2c015" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "carbon_footprint_recipes"`);
    }

}
