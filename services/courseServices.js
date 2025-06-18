const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCoursesBySchool = async (school) => {
  return await prisma.pre_final_courses.findMany({
    where: { school },
    select: {
      course_id: true,
      course_code: true,
      course_name: true,
      lecture: true,
      tutorial: true,
      practical: true,
      credits: true,
      slot: true,
      school: true,
    },
  });
};

module.exports = { getCoursesBySchool };
