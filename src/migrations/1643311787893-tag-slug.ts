import slugify from 'slugify';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { Tag } from 'src/modules/tags/entities/tag.entity';

export class tagSlug1643311787893 implements MigrationInterface {
  name = 'tagSlug1643311787893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "magicLinkHash"`);
    await queryRunner.query(
      `ALTER TABLE "tag" ADD "slug" character varying NOT NULL DEFAULT 'x'`,
    );

    await queryRunner.startTransaction();
    const tags = await queryRunner.manager.find(Tag);
    const updatedTags = tags.reduce((acc, curr) => {
      const baseSlug = slugify(curr.label, {
        lower: true,
        strict: true,
      });
      let slug;
      let slugIndex = 0;

      do {
        slug = `${baseSlug}${slugIndex > 0 ? `-${slugIndex}` : ''}`;
        slugIndex++;
      } while (
        tags.find((tag) => tag.slug === slug) !== undefined ||
        acc.find((tag) => tag.slug === slug) !== undefined
      );

      const tag = queryRunner.manager.create(Tag, { ...curr, slug });

      return [...acc, tag];
    }, []);

    await queryRunner.manager.save(updatedTags);
    await queryRunner.commitTransaction();

    await queryRunner.query(
      `ALTER TABLE "tag" ADD CONSTRAINT "UQ_3413aed3ecde54f832c4f44f045" UNIQUE ("slug")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tag" DROP CONSTRAINT "UQ_3413aed3ecde54f832c4f44f045"`,
    );
    await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "slug"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "magicLinkHash" character varying`,
    );
  }
}
