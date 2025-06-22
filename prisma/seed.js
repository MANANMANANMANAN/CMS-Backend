const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    // 1. Chairpersons
    await prisma.chairperson.deleteMany();
  await prisma.chairperson.createMany({
    data: [
      {
        chairperson_id: "chair1",
        chairperson_name: "Dr. Sharma",
        chairperson_school: "SCSE",
        chairperson_email: "chair.scse@univ.edu",
        school: "SCSE",
      },
      {
        chairperson_id: "chair2",
        chairperson_name: "Dr. Verma",
        chairperson_school: "SCEE",
        chairperson_email: "chair.scee@univ.edu",
        school: "SCEE",
      },
      {
        chairperson_id: "chair3",
        chairperson_name: "Dr. Iyer",
        chairperson_school: "SCENE",
        chairperson_email: "chair.scene@univ.edu",
        school: "SCENE",
      },
    ],
  });

  //   // 2. Professors
    
  // await prisma.professors.createMany({
  //   data: [
  //     {
  //       iid: "prof1",
  //       prof_name: "Prof. A",
  //       prof_email: "prof.a@univ.edu",
  //       school: "SCSE",
  //     },
  //     {
  //       iid: "prof2",
  //       prof_name: "Prof. B",
  //       prof_email: "prof.b@univ.edu",
  //       school: "SCEE",
  //     },
  //     {
  //       iid: "prof3",
  //       prof_name: "Prof. C",
  //       prof_email: "prof.c@univ.edu",
  //       school: "SCENE",
  //     },
  //   ],
  // });

  // 3. Courses
    await prisma.pre_final_courses.deleteMany();
  await prisma.pre_final_courses.createMany({
    data: [
      {
        course_id: "course1",
        course_code: "CS101",
        course_name: "Intro to Programming",
        school: "SCSE",
        lecture: 3,
        tutorial: 1,
        practical: 2,
        credits: 4,
      },
      {
        course_id: "course2",
        course_code: "CS102",
        course_name: "Data Structures",
        school: "SCSE",
        lecture: 3,
        tutorial: 1,
        practical: 2,
        credits: 4,
      },
      {
        course_id: "course3",
        course_code: "EE101",
        course_name: "Circuit Theory",
        school: "SCEE",
        lecture: 3,
        tutorial: 1,
        practical: 2,
        credits: 4,
      },
      {
        course_id: "course4",
        course_code: "EE102",
        course_name: "Digital Electronics",
        school: "SCEE",
        lecture: 3,
        tutorial: 1,
        practical: 2,
        credits: 4,
      },
      {
        course_id: "course5",
        course_code: "EN101",
        course_name: "Environmental Science",
        school: "SCENE",
        lecture: 3,
        tutorial: 1,
        practical: 2,
        credits: 4,
      },
      {
        course_id: "course6",
        course_code: "EN102",
        course_name: "Climate Change",
        school: "SCENE",
        lecture: 3,
        tutorial: 1,
        practical: 2,
        credits: 4,
      },
    ],
  });

  // 4. Pre Final Course Helper
//   await prisma.pre_final_course_helper.createMany({
//     data: [
//       {
//         uid: "helper1",
//         course_id: "course1",
//         branch: "SCSE",
//         course_type: "CORE",
//         semester: "5",
//         year: "2025",
//       },
//       {
//         uid: "helper2",
//         course_id: "course2",
//         branch: "SCSE",
//         course_type: "CORE",
//         semester: "5",
//         year: "2025",
//       },
//       {
//         uid: "helper3",
//         course_id: "course3",
//         branch: "SCEE",
//         course_type: "CORE",
//         semester: "5",
//         year: "2025",
//       },
//       {
//         uid: "helper4",
//         course_id: "course4",
//         branch: "SCEE",
//         course_type: "CORE",
//         semester: "5",
//         year: "2025",
//       },
//       {
//         uid: "helper5",
//         course_id: "course5",
//         branch: "SCENE",
//         course_type: "CORE",
//         semester: "5",
//         year: "2025",
//       },
//       {
//         uid: "helper6",
//         course_id: "course6",
//         branch: "SCENE",
//         course_type: "CORE",
//         semester: "5",
//         year: "2025",
//       },
//     ],
//   });

  // 5. Professor Course Requests (for testing GET/DELETE APIs)
  // await prisma.prof_course_req.createMany({
  //   data: [
  //     {
  //       request_id: "req1",
  //       iid: "prof1",
  //       course_code: "CS101",
  //       slot: "A",
  //       chairperson_id: "chair1",
  //       accept_reject: null,
  //     },
  //     {
  //       request_id: "req2",
  //       iid: "prof1",
  //       course_code: "CS102",
  //       slot: "B",
  //       chairperson_id: "chair1",
  //       accept_reject: null,
  //     },
  //     {
  //       request_id: "req3",
  //       iid: "prof2",
  //       course_code: "EE101",
  //       slot: "A",
  //       chairperson_id: "chair2",
  //       accept_reject: null,
  //     },
  //     {
  //       request_id: "req4",
  //       iid: "prof3",
  //       course_code: "EN101",
  //       slot: "A",
  //       chairperson_id: "chair3",
  //       accept_reject: null,
  //     },
  //   ],
  // });
}

main()
  .then(() => {
    console.log("✅ Seed data inserted successfully");
  })
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
