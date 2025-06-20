const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a sample course
  const course = await prisma.final_courses.upsert({
    where: { course_id: 'course3' },
    update: {},
    create: {
      course_id: 'course3',
      course_code: 'CS301',
      course_name: 'Advanced Algorithms',
      school: 'School of CS',
      lecture: 3,
      tutorial: 1,
      practical: 2,
      credits: 4,
      slot: 'B'
    },
  });

  // Create a sample student
  const student = await prisma.students.upsert({
    where: { student_id: 'S100001' },
    update: {},
    create: {
      student_id: 'S100001',
      student_name: 'Alice Sharma',
      branch: 'CSE',
      school: 'SCEE',
      batch: '2022',
      program: 'BTech',
      ldap_passwd: 'test123'
    }
  });

  // Pre-registration
  await prisma.student_pre_registered.create({
    data: {
      uid: 'prereg1',
      student_id: student.student_id,
      course_id: course.course_id,
      pre_reg_course_type: 'IC',
      accept_reject: true
    }
  });

  // Registration (finalized)
  await prisma.student_registered.create({
    data: {
      uid: 'reg1',
      student_id: student.student_id,
      course_id: course.course_id,
      reg_course_type: 'IC',
      status: 'A'
    }
  });

  // Create a professor
  const prof = await prisma.professors.upsert({
    where: { iid: 'P1001' },
    update: {},
    create: {
      iid: 'P1001',
      prof_name: 'Dr. Arjun Verma',
      prof_email: 'arjun@example.com',
      school: 'School of CS'
    }
  });

  // Assign professor to course
  await prisma.prof_course.create({
    data: {
      uid: 'prof_course_1',
      iid: prof.iid,
      course_id: course.course_id
    }
  });

  console.log('Seed data inserted ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
