import {MigrationInterface, QueryRunner} from "typeorm";

export class nftsPoc1659584850075 implements MigrationInterface {
    name = 'nftsPoc1659584850075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."claim_nftstatus_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "claim" ADD "nftStatus" "public"."claim_nftstatus_enum" NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "claim" ADD "nftTxId" character varying`);
        await queryRunner.query(`ALTER TABLE "claim" ADD "nftTokenId" character varying`);
        await queryRunner.query(`ALTER TABLE "claim" ADD "nftFractionalizationContractAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "claim" ADD "nftMetadataURI" character varying`);
        await queryRunner.query(`ALTER TABLE "claim" ADD "nftMetadataURICreatedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "claim" DROP COLUMN "nftMetadataURICreatedAt"`);
        await queryRunner.query(`ALTER TABLE "claim" DROP COLUMN "nftMetadataURI"`);
        await queryRunner.query(`ALTER TABLE "claim" DROP COLUMN "nftFractionalizationContractAddress"`);
        await queryRunner.query(`ALTER TABLE "claim" DROP COLUMN "nftTokenId"`);
        await queryRunner.query(`ALTER TABLE "claim" DROP COLUMN "nftTxId"`);
        await queryRunner.query(`ALTER TABLE "claim" DROP COLUMN "nftStatus"`);
        await queryRunner.query(`DROP TYPE "public"."claim_nftstatus_enum"`);
    }

}
