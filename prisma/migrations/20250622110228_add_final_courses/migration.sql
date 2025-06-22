-- CreateEnum
CREATE TYPE "roles" AS ENUM ('student', 'faculty', 'admin', 'chairperson');

-- CreateEnum
CREATE TYPE "fixed_course_type" AS ENUM ('IC', 'DC', 'DE', 'FE', 'HSS');

-- CreateEnum
CREATE TYPE "semesters" AS ENUM ('even', 'odd');

-- CreateEnum
CREATE TYPE "course_modes" AS ENUM ('regular', 'audit', 'pass_fail', 'equivalent', 'backlog');

-- CreateEnum
CREATE TYPE "course_query_type" AS ENUM ('course_transition', 'slot_clash', 'slot_change', 'curriculum', 'course_query', 'Others');

-- CreateEnum
CREATE TYPE "announcement_query_type" AS ENUM ('slot_change', 'course_add', 'course_drop', 'Others');

-- CreateTable
CREATE TABLE "Users" (
    "uid" VARCHAR(40) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "role" "roles" NOT NULL DEFAULT 'student',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "pre_final_course_helper" (
    "uid" VARCHAR(40) NOT NULL,
    "course_id" VARCHAR(40) NOT NULL,
    "branch" VARCHAR(50) NOT NULL,
    "program" VARCHAR(10) NOT NULL,
    "course_type" "fixed_course_type" NOT NULL,
    "semester" "semesters" NOT NULL,
    "year" VARCHAR(4) NOT NULL,

    CONSTRAINT "pre_final_course_helper_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "pre_final_courses" (
    "course_id" VARCHAR(40) NOT NULL,
    "course_code" VARCHAR(10) NOT NULL,
    "course_name" VARCHAR(255) NOT NULL,
    "school" VARCHAR(20) NOT NULL,
    "lecture" SMALLINT NOT NULL,
    "tutorial" SMALLINT NOT NULL,
    "practical" SMALLINT NOT NULL,
    "credits" SMALLINT NOT NULL,
    "slot" CHAR(1) NOT NULL DEFAULT 'N',
    "status" BOOLEAN,

    CONSTRAINT "pre_final_courses_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "prof_course_pre_final" (
    "uid" VARCHAR(40) NOT NULL,
    "course_id" VARCHAR(40) NOT NULL,
    "iid" VARCHAR(40) NOT NULL,

    CONSTRAINT "prof_course_pre_final_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "final_courses" (
    "course_id" VARCHAR(40) NOT NULL,
    "course_code" VARCHAR(10) NOT NULL,
    "course_name" VARCHAR(255) NOT NULL,
    "school" VARCHAR(20) NOT NULL,
    "lecture" SMALLINT NOT NULL,
    "tutorial" SMALLINT NOT NULL,
    "practical" SMALLINT NOT NULL,
    "credits" SMALLINT NOT NULL,
    "slot" CHAR(1) NOT NULL DEFAULT 'N',

    CONSTRAINT "final_courses_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "done_courses" (
    "course_id" VARCHAR(40) NOT NULL,
    "course_code" VARCHAR(10) NOT NULL,
    "course_name" VARCHAR(255) NOT NULL,
    "lecture" SMALLINT NOT NULL,
    "tutorial" SMALLINT NOT NULL,
    "practical" SMALLINT NOT NULL,
    "credits" SMALLINT NOT NULL,
    "slot" CHAR(1) NOT NULL DEFAULT 'N',

    CONSTRAINT "done_courses_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "course_helper" (
    "uid" VARCHAR(40) NOT NULL,
    "course_id" VARCHAR(40) NOT NULL,
    "branch" VARCHAR(50) NOT NULL,
    "program" VARCHAR(10) NOT NULL,
    "course_type" "fixed_course_type" NOT NULL,
    "semester" "semesters" NOT NULL,
    "year" VARCHAR(4) NOT NULL,

    CONSTRAINT "course_helper_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "students" (
    "student_id" VARCHAR(7) NOT NULL,
    "student_name" VARCHAR(255) NOT NULL,
    "branch" VARCHAR(50) NOT NULL,
    "school" VARCHAR(20) NOT NULL,
    "batch" VARCHAR(4) NOT NULL,
    "program" VARCHAR(10) NOT NULL,
    "ldap_passwd" TEXT NOT NULL,
    "user_uid" VARCHAR(40) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "student_done_courses" (
    "uid" VARCHAR(40) NOT NULL,
    "course_id" VARCHAR(40) NOT NULL,
    "student_id" VARCHAR(7) NOT NULL,
    "done_as_course_type" "fixed_course_type" NOT NULL,
    "course_mode" "course_modes" NOT NULL DEFAULT 'regular',
    "grade" VARCHAR(2) NOT NULL,

    CONSTRAINT "student_done_courses_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "student_pre_registered" (
    "uid" VARCHAR(40) NOT NULL,
    "student_id" VARCHAR(7) NOT NULL,
    "course_id" VARCHAR(40) NOT NULL,
    "pre_reg_course_type" "fixed_course_type" NOT NULL,
    "pre_reg_course_mode" "course_modes" NOT NULL DEFAULT 'regular',
    "accept_reject" BOOLEAN NOT NULL,

    CONSTRAINT "student_pre_registered_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "student_lesser_credits" (
    "uid" VARCHAR(40) NOT NULL,
    "student_id" VARCHAR(7) NOT NULL,
    "max_credits" SMALLINT NOT NULL,
    "min_credits" SMALLINT NOT NULL,

    CONSTRAINT "student_lesser_credits_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "student_registered" (
    "uid" VARCHAR(40) NOT NULL,
    "student_id" VARCHAR(7) NOT NULL,
    "course_id" VARCHAR(40) NOT NULL,
    "reg_course_type" "fixed_course_type" NOT NULL,
    "reg_course_mode" "course_modes" NOT NULL DEFAULT 'regular',
    "status" VARCHAR(2) NOT NULL DEFAULT 'I',

    CONSTRAINT "student_registered_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "professors" (
    "iid" VARCHAR(40) NOT NULL,
    "prof_name" VARCHAR(50) NOT NULL,
    "prof_email" VARCHAR(254) NOT NULL,
    "school" VARCHAR(20) NOT NULL,

    CONSTRAINT "professors_pkey" PRIMARY KEY ("iid")
);

-- CreateTable
CREATE TABLE "prof_course" (
    "uid" VARCHAR(40) NOT NULL,
    "iid" VARCHAR(40) NOT NULL,
    "course_id" VARCHAR(40) NOT NULL,

    CONSTRAINT "prof_course_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "prof_course_req" (
    "request_id" VARCHAR(40) NOT NULL,
    "iid" VARCHAR(40) NOT NULL,
    "course_code" VARCHAR(10) NOT NULL,
    "slot" CHAR(1) NOT NULL DEFAULT 'N',
    "chairperson_id" VARCHAR(40) NOT NULL,
    "accept_reject" BOOLEAN,

    CONSTRAINT "prof_course_req_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "admins" (
    "admin_id" VARCHAR(40) NOT NULL,
    "admin_name" VARCHAR(255) NOT NULL,
    "admin_email" VARCHAR(254) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "chairperson" (
    "chairperson_id" VARCHAR(40) NOT NULL,
    "chairperson_name" VARCHAR(255) NOT NULL,
    "chairperson_school" VARCHAR(20) NOT NULL,
    "chairperson_email" VARCHAR(254) NOT NULL,
    "school" VARCHAR(20) NOT NULL,

    CONSTRAINT "chairperson_pkey" PRIMARY KEY ("chairperson_id")
);

-- CreateTable
CREATE TABLE "announcement" (
    "announcement_id" VARCHAR(40) NOT NULL,
    "announcement" TEXT NOT NULL,
    "admin_id" VARCHAR(40) NOT NULL,

    CONSTRAINT "announcement_pkey" PRIMARY KEY ("announcement_id")
);

-- CreateTable
CREATE TABLE "announcement_queries" (
    "query_id" VARCHAR(40) NOT NULL,
    "student_id" VARCHAR(7) NOT NULL,
    "announcement_id" VARCHAR(40) NOT NULL,
    "query" TEXT NOT NULL,
    "query_type" "announcement_query_type" NOT NULL,
    "response" TEXT NOT NULL,
    "responded" BOOLEAN NOT NULL,

    CONSTRAINT "announcement_queries_pkey" PRIMARY KEY ("query_id")
);

-- CreateTable
CREATE TABLE "course_announcement" (
    "announcement_id" VARCHAR(40) NOT NULL,
    "announcement" TEXT NOT NULL,
    "iid" VARCHAR(40) NOT NULL,

    CONSTRAINT "course_announcement_pkey" PRIMARY KEY ("announcement_id")
);

-- CreateTable
CREATE TABLE "course_queries" (
    "query_id" VARCHAR(40) NOT NULL,
    "student_id" VARCHAR(7) NOT NULL,
    "course_id" VARCHAR(40) NOT NULL,
    "announcement_id" VARCHAR(40) NOT NULL,
    "query_type" "course_query_type" NOT NULL,
    "query" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "responded" BOOLEAN NOT NULL,

    CONSTRAINT "course_queries_pkey" PRIMARY KEY ("query_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "final_courses_course_id_idx" ON "final_courses"("course_id");

-- CreateIndex
CREATE INDEX "done_courses_course_id_idx" ON "done_courses"("course_id");

-- CreateIndex
CREATE INDEX "course_helper_course_id_idx" ON "course_helper"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_uid_key" ON "students"("user_uid");

-- CreateIndex
CREATE INDEX "students_student_id_idx" ON "students"("student_id");

-- CreateIndex
CREATE INDEX "student_done_courses_student_id_course_id_idx" ON "student_done_courses"("student_id", "course_id");

-- CreateIndex
CREATE INDEX "student_pre_registered_student_id_course_id_idx" ON "student_pre_registered"("student_id", "course_id");

-- CreateIndex
CREATE INDEX "student_registered_student_id_course_id_idx" ON "student_registered"("student_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "professors_prof_email_key" ON "professors"("prof_email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_admin_email_key" ON "admins"("admin_email");

-- CreateIndex
CREATE UNIQUE INDEX "chairperson_chairperson_email_key" ON "chairperson"("chairperson_email");

-- AddForeignKey
ALTER TABLE "pre_final_course_helper" ADD CONSTRAINT "pre_final_course_helper_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "pre_final_courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prof_course_pre_final" ADD CONSTRAINT "prof_course_pre_final_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "pre_final_courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prof_course_pre_final" ADD CONSTRAINT "prof_course_pre_final_iid_fkey" FOREIGN KEY ("iid") REFERENCES "professors"("iid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_helper" ADD CONSTRAINT "course_helper_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "final_courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_uid_fkey" FOREIGN KEY ("user_uid") REFERENCES "Users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_done_courses" ADD CONSTRAINT "student_done_courses_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_done_courses" ADD CONSTRAINT "student_done_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "done_courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_pre_registered" ADD CONSTRAINT "student_pre_registered_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_pre_registered" ADD CONSTRAINT "student_pre_registered_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "final_courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_lesser_credits" ADD CONSTRAINT "student_lesser_credits_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_registered" ADD CONSTRAINT "student_registered_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_registered" ADD CONSTRAINT "student_registered_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "final_courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prof_course" ADD CONSTRAINT "prof_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "final_courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prof_course" ADD CONSTRAINT "prof_course_iid_fkey" FOREIGN KEY ("iid") REFERENCES "professors"("iid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prof_course_req" ADD CONSTRAINT "prof_course_req_iid_fkey" FOREIGN KEY ("iid") REFERENCES "professors"("iid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_queries" ADD CONSTRAINT "announcement_queries_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_queries" ADD CONSTRAINT "announcement_queries_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcement"("announcement_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_announcement" ADD CONSTRAINT "course_announcement_iid_fkey" FOREIGN KEY ("iid") REFERENCES "professors"("iid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_queries" ADD CONSTRAINT "course_queries_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_queries" ADD CONSTRAINT "course_queries_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "final_courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_queries" ADD CONSTRAINT "course_queries_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "course_announcement"("announcement_id") ON DELETE RESTRICT ON UPDATE CASCADE;
