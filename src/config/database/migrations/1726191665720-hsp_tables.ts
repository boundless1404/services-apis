import { MigrationInterface, QueryRunner } from 'typeorm';

export class HspTables1726191665720 implements MigrationInterface {
  name = 'HspTables1726191665720';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "currency" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "fullname" character varying, "symbol" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "countryId" bigint NOT NULL, CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "country_state" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "postalCode" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "countryId" bigint NOT NULL, CONSTRAINT "PK_d3768279d2eed5508461694c82b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "suite_property_location" ("suiteProperyId" bigint NOT NULL, "streetNumber" character varying NOT NULL, "street" character varying NOT NULL, "city" character varying NOT NULL, "postalCode" character varying NOT NULL, "landmark" character varying NOT NULL, "countryStateId" bigint NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "countryId" bigint NOT NULL, CONSTRAINT "PK_2a805d32aa9e73006b845bee1b5" PRIMARY KEY ("suiteProperyId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "country" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "fullname" character varying NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_subscriber_user_review" ("id" BIGSERIAL NOT NULL, "comment" character varying NOT NULL, "ratingScore" integer NOT NULL, "serviceSubscriberUserId" bigint NOT NULL, "suitePropertyId" bigint NOT NULL, CONSTRAINT "PK_abaa2219dd6c8c9a7edbb3e9ccd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_client" ("id" BIGSERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "phone" character varying NOT NULL, "phoneCodeId" bigint NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "subscriberUserId" bigint NOT NULL, CONSTRAINT "PK_d20a2a1586ecffa0b5ee5482c34" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_subscriber_user" ("id" BIGSERIAL NOT NULL, "email" character varying, "phone" character varying, "phoneCodeId" bigint, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6359bb0faa4a023a6f3a55931b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "phone_code" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "countryId" bigint NOT NULL, CONSTRAINT "PK_63535b596f66607b3da0ead52e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "suite_property_feature" ("suitePropertyId" bigint NOT NULL, "suiteFeatureId" bigint NOT NULL, "suiteSpecificDescription" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_35048281b7a2358e116e7f8a788" PRIMARY KEY ("suitePropertyId", "suiteFeatureId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "suite_feature" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "serviceProviderUserId" bigint, CONSTRAINT "PK_39baaea8a41008f9f2fe68b852e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_provider_user" ("id" BIGSERIAL NOT NULL, "email" character varying NOT NULL, "phone" character varying, "phoneCodeId" bigint, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "serviceProviderId" bigint NOT NULL, CONSTRAINT "PK_3e0914cbe907fa7430d3da84e84" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_provider" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7610a92ca242cb29d96009caa19" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."file_mimetype_enum" AS ENUM('image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp', 'application/pdf', 'application/msword', 'app/vnd.ooxml.wordprocessing', 'application/vnd.ms-excel', 'app/vnd.ooxml.spreadsheet', 'application/vnd.ms-powerpoint', 'app/vnd.ooxml.presentation', 'text/plain', 'application/rtf', 'text/html', 'text/css', 'application/javascript', 'application/json', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'video/mp4', 'video/webm', 'video/x-msvideo', 'application/zip', 'application/x-rar-compressed', 'application/octet-stream')`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "mimetype" "public"."file_mimetype_enum" NOT NULL, "size" integer NOT NULL, "url" character varying NOT NULL, "key" character varying NOT NULL, "filePurpose" character varying, "metadata" jsonb, "fileServerStatus" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "serviceId" bigint, "suitePropertyId" bigint, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b99597d0502727168be8ee7a63" ON "file" ("filePurpose") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c40243b30b30087fc0cef9c236" ON "file" ("fileServerStatus") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_18a0ad156828b598fcef570209" ON "file" ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d336bee718f4b96da84e8a2b1c" ON "file" ("updatedAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_335685f380a445ccd86ca2c1d6" ON "file" ("deletedAt") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."service_type_enum" AS ENUM('suite-property', 'auto-service', 'tourism')`,
    );
    await queryRunner.query(
      `CREATE TABLE "service" ("id" BIGSERIAL NOT NULL, "name" character varying, "description" text, "type" "public"."service_type_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "serviceProviderId" bigint NOT NULL, CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."service_booking_status_enum" AS ENUM('pending', 'completed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_booking" ("id" BIGSERIAL NOT NULL, "status" "public"."service_booking_status_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "serviceClientId" bigint NOT NULL, "serviceId" bigint NOT NULL, CONSTRAINT "PK_9d09944bb5f60931975225747da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "suite_booking_detail" ("serviceBookingId" bigint NOT NULL, "checkInDate" date NOT NULL, "checkOutDate" date NOT NULL, "numberOfAdults" integer NOT NULL, "numberOfChildren" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_db61bfb206834d362e21c8514ec" PRIMARY KEY ("serviceBookingId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "suite_property_section_booking" ("suitePropertySectionId" bigint NOT NULL, "suiteBookingDetailsId" bigint NOT NULL, CONSTRAINT "PK_830ae02c5ada868cef261d0f4b8" PRIMARY KEY ("suitePropertySectionId", "suiteBookingDetailsId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "suite_property_section" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "isOccupied" boolean, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "suitePropertyId" bigint NOT NULL, CONSTRAINT "PK_9ca1fe2739637daa3e700a7104f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."suite_property_type_enum" AS ENUM('rooms', 'apartment', 'event-hall', 'beach-house')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."suite_property_category_enum" AS ENUM('adjacent-rooms', 'accessible-rooms', 'duplex-rooms-suite', 'adjoining_joint_rooms', 'cubana', 'connecting_rooms', 'double_room', 'deluxe_room', 'double_double_room', 'executive_room', 'hollywood_twin', 'hostel_dorm_room', 'junior_suite_mini_suite', 'king_room', 'master_suite_suite', 'murphy_town', 'penthouse_room', 'presidental_royal_suite', 'pool_suite', 'pool_access_room', 'quad_room', 'queen_room', 'single_room', 'studio_apartment_room', 'smoking_room', 'super_deluxe', 'triple_room', 'twin_room', 'villa', 'apartment_extended_stay_hotel_room')`,
    );
    await queryRunner.query(
      `CREATE TABLE "suite_property" ("id" BIGSERIAL NOT NULL, "type" "public"."suite_property_type_enum", "category" "public"."suite_property_category_enum", "description" text NOT NULL, "availableQuantity" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "serviceProviderId" bigint NOT NULL, CONSTRAINT "PK_f629dbcb2f05266798bc2f8ee2d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."email_priority_enum" AS ENUM('immediate', 'regular', 'delayed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "email" ("id" BIGSERIAL NOT NULL, "priority" "public"."email_priority_enum" NOT NULL DEFAULT 'regular', "attachmentFileUrls" jsonb, "body" json NOT NULL, "sendAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_1e7ed8734ee054ef18002e29b1c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sms" ("id" BIGSERIAL NOT NULL, "content" text NOT NULL, "sender" character varying NOT NULL, "to" character varying NOT NULL, CONSTRAINT "PK_60793c2f16aafe0513f8817eae8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."profile_summary_profiletype_enum" AS ENUM('service_provider_user', 'service_subscriber_user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "profile_summary" ("id" BIGSERIAL NOT NULL, "profileType" "public"."profile_summary_profiletype_enum", "profileTypeId" bigint NOT NULL, "userId" bigint NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f4260becfd61e910510710e9340" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "currency" ADD CONSTRAINT "FK_f06fe84c2edce16808c79cf9f8e" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "country_state" ADD CONSTRAINT "FK_ea37e26ecd4e7e0067334cce672" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_location" ADD CONSTRAINT "FK_37e8168009954b03dec85df8522" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_location" ADD CONSTRAINT "FK_2a805d32aa9e73006b845bee1b5" FOREIGN KEY ("suiteProperyId") REFERENCES "suite_property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_location" ADD CONSTRAINT "FK_acf42bf178759b48d4690b16e47" FOREIGN KEY ("countryStateId") REFERENCES "country_state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_subscriber_user_review" ADD CONSTRAINT "FK_d1837ace23bfddb32374081c6f7" FOREIGN KEY ("serviceSubscriberUserId") REFERENCES "service_subscriber_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_subscriber_user_review" ADD CONSTRAINT "FK_20529c9233a44d9c3fb3cda0685" FOREIGN KEY ("suitePropertyId") REFERENCES "suite_property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_client" ADD CONSTRAINT "FK_033504cd0f7223aeb19c80820e2" FOREIGN KEY ("subscriberUserId") REFERENCES "service_subscriber_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_subscriber_user" ADD CONSTRAINT "FK_7c78ddabafb5a3794cfb14e83c8" FOREIGN KEY ("phoneCodeId") REFERENCES "phone_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "phone_code" ADD CONSTRAINT "FK_62d3c2889dcb44ef26531d68dbf" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_feature" ADD CONSTRAINT "FK_90f6786ead6d27a6de14eab17c3" FOREIGN KEY ("suitePropertyId") REFERENCES "suite_property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_feature" ADD CONSTRAINT "FK_7b79b0aface36df375564d49393" FOREIGN KEY ("suiteFeatureId") REFERENCES "suite_feature"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_feature" ADD CONSTRAINT "FK_533fcfdbb9a57de1f4b03a26053" FOREIGN KEY ("serviceProviderUserId") REFERENCES "service_provider_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_provider_user" ADD CONSTRAINT "FK_b388200af755e16e3269a5f7085" FOREIGN KEY ("serviceProviderId") REFERENCES "service_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_provider_user" ADD CONSTRAINT "FK_c56fae0b9e65f7a20d53f9033ec" FOREIGN KEY ("phoneCodeId") REFERENCES "phone_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_b19526fc3643c68b0abd20c0a57" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_3a3ba1fb649727376d3ad1162b7" FOREIGN KEY ("suitePropertyId") REFERENCES "suite_property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service" ADD CONSTRAINT "FK_0d428b99abd863110a478fdfa54" FOREIGN KEY ("serviceProviderId") REFERENCES "service_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_booking" ADD CONSTRAINT "FK_a254515f07d3a054d9da0ca485b" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_booking" ADD CONSTRAINT "FK_1cbe81d701a8a88b7619cb24cea" FOREIGN KEY ("serviceClientId") REFERENCES "service_client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_booking_detail" ADD CONSTRAINT "FK_db61bfb206834d362e21c8514ec" FOREIGN KEY ("serviceBookingId") REFERENCES "service_booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_section_booking" ADD CONSTRAINT "FK_fe674e3603ddb428b474175624b" FOREIGN KEY ("suitePropertySectionId") REFERENCES "suite_property_section"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_section_booking" ADD CONSTRAINT "FK_5b39c8c229e79ac1a76a4135f9c" FOREIGN KEY ("suiteBookingDetailsId") REFERENCES "suite_booking_detail"("serviceBookingId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_section" ADD CONSTRAINT "FK_496e03ffbbbb08e5c0959ba6b79" FOREIGN KEY ("suitePropertyId") REFERENCES "suite_property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property" ADD CONSTRAINT "FK_1c28f9388a80418cdc061ac518d" FOREIGN KEY ("serviceProviderId") REFERENCES "service_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE "typeorm_cache_table" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_1f1c066da68820c20a4ff873df1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "typeorm_cache_table"`);
    await queryRunner.query(
      `ALTER TABLE "suite_property" DROP CONSTRAINT "FK_1c28f9388a80418cdc061ac518d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_section" DROP CONSTRAINT "FK_496e03ffbbbb08e5c0959ba6b79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_section_booking" DROP CONSTRAINT "FK_5b39c8c229e79ac1a76a4135f9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_section_booking" DROP CONSTRAINT "FK_fe674e3603ddb428b474175624b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_booking_detail" DROP CONSTRAINT "FK_db61bfb206834d362e21c8514ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_booking" DROP CONSTRAINT "FK_1cbe81d701a8a88b7619cb24cea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_booking" DROP CONSTRAINT "FK_a254515f07d3a054d9da0ca485b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service" DROP CONSTRAINT "FK_0d428b99abd863110a478fdfa54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_3a3ba1fb649727376d3ad1162b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_b19526fc3643c68b0abd20c0a57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_provider_user" DROP CONSTRAINT "FK_c56fae0b9e65f7a20d53f9033ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_provider_user" DROP CONSTRAINT "FK_b388200af755e16e3269a5f7085"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_feature" DROP CONSTRAINT "FK_533fcfdbb9a57de1f4b03a26053"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_feature" DROP CONSTRAINT "FK_7b79b0aface36df375564d49393"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_feature" DROP CONSTRAINT "FK_90f6786ead6d27a6de14eab17c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "phone_code" DROP CONSTRAINT "FK_62d3c2889dcb44ef26531d68dbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_subscriber_user" DROP CONSTRAINT "FK_7c78ddabafb5a3794cfb14e83c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_client" DROP CONSTRAINT "FK_033504cd0f7223aeb19c80820e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_subscriber_user_review" DROP CONSTRAINT "FK_20529c9233a44d9c3fb3cda0685"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_subscriber_user_review" DROP CONSTRAINT "FK_d1837ace23bfddb32374081c6f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_location" DROP CONSTRAINT "FK_acf42bf178759b48d4690b16e47"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_location" DROP CONSTRAINT "FK_2a805d32aa9e73006b845bee1b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suite_property_location" DROP CONSTRAINT "FK_37e8168009954b03dec85df8522"`,
    );
    await queryRunner.query(
      `ALTER TABLE "country_state" DROP CONSTRAINT "FK_ea37e26ecd4e7e0067334cce672"`,
    );
    await queryRunner.query(
      `ALTER TABLE "currency" DROP CONSTRAINT "FK_f06fe84c2edce16808c79cf9f8e"`,
    );
    await queryRunner.query(`DROP TABLE "profile_summary"`);
    await queryRunner.query(
      `DROP TYPE "public"."profile_summary_profiletype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "sms"`);
    await queryRunner.query(`DROP TABLE "email"`);
    await queryRunner.query(`DROP TYPE "public"."email_priority_enum"`);
    await queryRunner.query(`DROP TABLE "suite_property"`);
    await queryRunner.query(
      `DROP TYPE "public"."suite_property_category_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."suite_property_type_enum"`);
    await queryRunner.query(`DROP TABLE "suite_property_section"`);
    await queryRunner.query(`DROP TABLE "suite_property_section_booking"`);
    await queryRunner.query(`DROP TABLE "suite_booking_detail"`);
    await queryRunner.query(`DROP TABLE "service_booking"`);
    await queryRunner.query(`DROP TYPE "public"."service_booking_status_enum"`);
    await queryRunner.query(`DROP TABLE "service"`);
    await queryRunner.query(`DROP TYPE "public"."service_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_335685f380a445ccd86ca2c1d6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d336bee718f4b96da84e8a2b1c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_18a0ad156828b598fcef570209"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c40243b30b30087fc0cef9c236"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b99597d0502727168be8ee7a63"`,
    );
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TYPE "public"."file_mimetype_enum"`);
    await queryRunner.query(`DROP TABLE "service_provider"`);
    await queryRunner.query(`DROP TABLE "service_provider_user"`);
    await queryRunner.query(`DROP TABLE "suite_feature"`);
    await queryRunner.query(`DROP TABLE "suite_property_feature"`);
    await queryRunner.query(`DROP TABLE "phone_code"`);
    await queryRunner.query(`DROP TABLE "service_subscriber_user"`);
    await queryRunner.query(`DROP TABLE "service_client"`);
    await queryRunner.query(`DROP TABLE "service_subscriber_user_review"`);
    await queryRunner.query(`DROP TABLE "country"`);
    await queryRunner.query(`DROP TABLE "suite_property_location"`);
    await queryRunner.query(`DROP TABLE "country_state"`);
    await queryRunner.query(`DROP TABLE "currency"`);
  }
}
