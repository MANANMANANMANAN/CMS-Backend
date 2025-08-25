const controller = require("../controllers/UsefulController");
const { PrismaClient } = require('@prisma/client');
jest.mock('@prisma/client', () => {
  const mPrisma = {
    professors: { findUnique: jest.fn() },
    chairperson: { findFirst: jest.fn() },
    prof_course_req: { findFirst: jest.fn(), create: jest.fn(), delete: jest.fn() },
    prof_course_pre_final: { findFirst: jest.fn(), create: jest.fn(), delete: jest.fn() },
    pre_final_courses: { findFirst: jest.fn(), findMany: jest.fn() },
    student_pre_registered: { findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn() },
    student_registered: { create: jest.fn(), deleteMany: jest.fn() },
    prof_course: { findMany: jest.fn() },
    final_courses: { findMany: jest.fn() },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

// Mock token generator
jest.mock('../middleware/auth', () => ({
  generateToken: jest.fn().mockReturnValue('fake-jwt-token')
}));

// Utility: mock res object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
describe('login', () => {
  it('should return 400 if iid or password missing', async () => {
    const req = { body: { iid: '', password: '' } };
    const res = mockResponse();

    await controller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Student ID and password are required" });
  });

  it('should return 401 if professor not found', async () => {
    const req = { body: { iid: 'prof123', password: 'pass' } };
    const res = mockResponse();

    const prisma = new PrismaClient();
    prisma.professors.findUnique.mockResolvedValue(null);

    await controller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid Instructor ID or password" });
  });

  it('should return token if login successful', async () => {
    const req = { body: { iid: 'prof123', password: 'pass' } };
    const res = mockResponse();

    const prisma = new PrismaClient();
    prisma.professors.findUnique.mockResolvedValue({ iid: 'prof123', prof_email: 'test@mail.com' });

    await controller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Logged in successfully",
      token: "fake-jwt-token",
      student: { iid: 'prof123' }
    }));
  });
});
