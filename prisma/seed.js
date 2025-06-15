const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Add dummy students
  await prisma.students.create({
    data: {
      student_id: 'S100001',
      student_name: 'Alice Kumar',
      branch: 'CSE',
      school: 'SoICT',
      batch: '2022',
      program: 'BTech',
      ldap_passwd: 'password123',
    },
  });

  // Add dummy professor
  await prisma.professors.create({
    data: {
      iid: 'P100001',
      prof_name: 'Dr. John Doe',
      prof_email: 'johndoe@example.com',
    },
  });

  // Add dummy chairperson
  await prisma.chairperson.create({
    data: {
      chairperson_id: 'C100001',
      chairperson_name: 'Dr. Jane Smith',
      chairperson_email: 'janesmith@example.com',
    },
  });

  // Add dummy course
  await prisma.all_courses.create({
    data: {
      course_id: 'COURSE001',
      course_code: 'CS101',
      course_name: 'Introduction to Programming',
      lecture: 3,
      tutorial: 1,
      practical: 2,
      credits: 4,
    },
  });

  // Add dummy course_helper
  await prisma.course_helper.create({
    data: {
      uid: 'CH001',
      course_id: 'COURSE001',
      branch: 'CSE',
      course_type: 'IC',
      semester: 'odd',
      year: '2024',
    },
  });

  // Add dummy student_pre_registered
  await prisma.student_pre_registered.create({
    data: {
      uid: 'PR001',
      student_id: 'S100001',
      course_id: 'COURSE001',
      pre_reg_course_type: 'IC',
      accept_reject: false,
    },
  });

  // Add dummy student_registered
  await prisma.student_registered.create({
    data: {
      uid: 'R001',
      student_id: 'S100001',
      course_id: 'COURSE001',
      reg_course_type: 'IC',
      status: 'I',
    },
  });

  // Add dummy done_course
  await prisma.done_courses.create({
    data: {
      course_id: 'DONE001',
      course_code: 'CS100',
      course_name: 'Basics of Computers',
      lecture: 2,
      tutorial: 1,
      practical: 1,
      credits: 3,
    },
  });

  // Add dummy student_done_courses
  await prisma.student_done_courses.create({
    data: {
      uid: 'SD001',
      course_id: 'DONE001',
      student_id: 'S100001',
      done_as_course_type: 'IC',
      grade: 'A+',
    },
  });

  console.log('✅ Dummy data inserted');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
