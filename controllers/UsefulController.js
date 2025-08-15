const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateToken } = require('../middleware/auth'); // adjust path as needed
exports.requestCourse = async (req, res) => { 
  const { courseCodes, iid } = req.body; 
   
  try { 
    
    const results = [];
    
    // Get professor's school first
    const professor = await prisma.professors.findUnique({
      where: { iid: iid }
    });
    if (!professor) {
      return res.status(404).json({
        success: false,
        error: 'Professor not found'
      });
    }
    console.log(professor)
    // Get chairperson_id based on professor's school
    const chairperson = await prisma.chairperson.findFirst({
      where: { school: professor.school }
    });
    
    if (!chairperson) {
      return res.status(404).json({
        success: false,
        error: `Chairperson not found for school: ${professor.school}`
      });
    }
    console.log(chairperson)
    const chairperson_id = chairperson.chairperson_id;
    
    // Loop through each course in the courseCodes array
    for (let i = 0; i < courseCodes.length; i++) {
      const courseCode = courseCodes[i];
      
      // Check if entry exists in prof_course_req table
      const existingEntry = await prisma.prof_course_req.findFirst({
        where: {
          iid: iid,
          course_code: courseCode
        }
      });
      
      if (existingEntry) {
        // Entry exists in prof_course_req - DELETE from both tables
        
        // Delete from prof_course_req
        await prisma.prof_course_req.delete({
          where: {
            request_id: existingEntry.request_id
          }
        });
        
        // Find and delete from prof_course_pre_final (need to find course_id first)
        const preFinEntry = await prisma.prof_course_pre_final.findFirst({
          where: {
            iid: iid,
            course: {
              course_code: courseCode // Assuming pre_final_courses has course_code field
            }
          }
        });
        
        if (preFinEntry) {
          await prisma.prof_course_pre_final.delete({
            where: {
              uid: preFinEntry.uid
            }
          });
        }
        
        results.push({
          courseCode: courseCode,
          action: 'deleted',
          message: `Request for course ${courseCode} has been removed from both tables`
        });
      } else {
        // Entry doesn't exist in prof_course_req - CREATE in both tables
        
        // Find the course_id and slot from pre_final_courses table based on course_code
        const preFinalCourse = await prisma.pre_final_courses.findFirst({
          where: {
            course_code: courseCode
          }
        });
        
        if (!preFinalCourse) {
          results.push({
            courseCode: courseCode,
            action: 'skipped',
            message: `Course ${courseCode} not found in pre_final_courses table`
          });
          continue;
        }
        
        const slot = preFinalCourse.slot; // Get slot from pre_final_courses table
        
        // Create new entry in prof_course_req
        const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${iid.substr(-4)}`; // Simple ID generation
        
        const newRequest = await prisma.prof_course_req.create({
          data: {
            request_id: requestId,
            course_code: courseCode,
            accept_reject: false, // Default to false (pending)
            chairperson_id: chairperson_id,
            slot: slot,
            // Connect to existing professor via relation
            professor: {
              connect: { iid: iid }
            }
          }
        });
        
        // Find the course_id from pre_final_courses table based on course_code
        // const preFinalCourse = await prisma.pre_final_courses.findFirst({
        //   where: {
        //     course_code: courseCode
        //   }
        // });
        
        if (preFinalCourse) {
          // Generate unique uid that fits VARCHAR(40) constraint
          const timestamp = Date.now().toString().substr(-8); // Last 8 digits of timestamp
          const profId = iid.substr(-4); // Last 4 chars of professor ID
          const courseId = preFinalCourse.course_id.substr(-4); // Last 4 chars of course ID
          const uid = `${profId}-${courseId}-${timestamp}`; // Format: XXXX-XXXX-XXXXXXXX (max 21 chars)
          
          // Create entry in prof_course_pre_final
          await prisma.prof_course_pre_final.create({
            data: {
              uid: uid,
              course: {
                connect: { course_id: preFinalCourse.course_id }
              },
              professor: {
                connect: { iid: iid }
              }
            }
          });
        }
        
        results.push({
          courseCode: courseCode,
          action: 'created',
          message: `Request for course ${courseCode} has been created in both tables`,
          requestId: newRequest.request_id
        });
      }
    }
 
    res.json({ 
      success: true,
      message: 'Course requests processed successfully',
      results: results
    }); 
  } catch (err) { 
    console.error('Error processing course requests:', err); 
    res.status(500).json({ 
      success: false,
      error: 'Failed to process course requests.',
      details: err.message 
    }); 
  } 
};
exports.accept_reject_students = async (req, res) => { 
  const { uids } = req.body; 
  try { 
    const results = [];
    
    for (let i = 0; i < uids.length; i++) {
      const uid = uids[i];
      
      // Find the pre-registration record using UID
      const student = await prisma.student_pre_registered.findUnique({
        where: {
          uid: uid
        }
      });
      
      if (!student) {
        results.push({
          uid: uid,
          action: 'error',
          message: `Pre-registration record not found for UID: ${uid}`
        });
        continue;
      }
      
      // Extract student_id and course_id from the pre-registration record
      const student_id = student.student_id;
      const course_id = student.course_id;
      
      if (student.accept_reject == true) {
        // Currently accepted - REJECT (revert to pre-registration)
        
        // Update the pre-registration record to rejected
        await prisma.student_pre_registered.update({
          where: {
            uid: uid
          },
          data: {
            accept_reject: false
          }
        });
        
        // Delete from student_registered table
        await prisma.student_registered.deleteMany({
          where: {
            student_id: student_id,
            course_id: course_id
          }
        });
        
        results.push({
          uid: uid,
          student_id: student_id,
          course_id: course_id,
          action: 'rejected',
          message: `Registration reverted to pre-registration`
        });
        
      } else {
        // Currently rejected/pending - ACCEPT
        
        // Update the pre-registration record to accepted
        await prisma.student_pre_registered.update({
          where: {
            uid: uid
          },
          data: {
            accept_reject: true
          }
        });
        
        // Create new registration record
        const newRegistration = await prisma.student_registered.create({
          data: {
            student_id: student_id,
            course_id: course_id,
            reg_course_type: student.pre_reg_course_type,
            reg_course_mode: student.pre_reg_course_mode,
            uid: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${student_id.substr(-4)}`,
            // Add other required fields based on your schema
            status: 'R' // or whatever default status you need
          }
        });
        
        results.push({
          uid: uid,
          student_id: student_id,
          course_id: course_id,
          action: 'accepted',
          message: `Student registration accepted`,
          registrationId: newRegistration.uid
        });
      }
    }
 
    res.json({ 
      success: true,
      message: 'Student registrations processed successfully',
      results: results
    }); 
  } catch (err) { 
    console.error('Error processing student registrations:', err); 
    res.status(500).json({ 
      success: false,
      error: 'Failed to process student registrations.',
      details: err.message 
    }); 
  } 
};
exports.login = async (req, res, next) => {
  try {
    const { iid, password } = req.body;
    
    // Validate input
    if (!iid || !password) {
      res.status(400).json({ message: "Student ID and password are required" });
      return;
    }
    
    // Find student
    const corresponding = await prisma.professors.findUnique({
      where: {
        iid : iid
      }
    });
    
    if (!corresponding) {
      res.status(401).json({ message: "Invalid Instructor ID or password" });
      return;
    }
    
    // // Verify password
    // const chk = await verifyPassword(password, corresponding.ldap_passwd);
    
    // if (!chk) {
    //   res.status(401).json({ message: "Invalid student ID or password" });
    //   return;
    // }
    
    // Get user details
    // const usr = await prisma.users.findUnique({
    //   where: {
    //     uid: corresponding.user_uid
    //   }
    // });
    
    // if (!usr) {
    //   res.status(401).json({ message: "User account not found" });
    //   return;
    // }
    
    // Generate JWT token
    const token = generateToken({
      iid: corresponding.iid,
    //   user_uid: usr.uid,
      email: corresponding.prof_email
    });
    
    // Return success response with token
    res.status(200).json({
      message: "Logged in successfully",
      token: token,
      student: {
        iid: corresponding.iid,
        // Add other safe student fields you want to expose
      },
    //   user: {
    //     uid: usr.uid,
    //     email: usr.email,
    //     // Add other safe user fields you want to expose
    //   }
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
exports.pre_final_courses = async (req, res) => { 
  try { 
    const courses = await prisma.pre_final_courses.findMany({
      orderBy: {
        course_name: 'asc'
      }
    });
    if (!courses || courses.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No pre-final courses found'
      });
    }
    res.json({ 
      success: true,
      message: 'Pre-final courses retrieved successfully',
      count: courses.length,
      courses: courses
    }); 

  } catch (err) { 
    console.error('Error fetching pre-final courses:', err); 
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch pre-final courses.',
      details: err.message 
    }); 
  } 
};
exports.requested_courses = async (req, res) => {
  try {
    const { iid } = req.params;

    // Step 1: Get the professor's requested course codes with accept_reject status
    const requested = await prisma.prof_course_req.findMany({
      where: { iid },
      select: {
        course_code: true,
        accept_reject: true
      }
    });

    if (!requested || requested.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No course requests found for iid: ${iid}`
      });
    }

    // Step 2: Get the matching courses from pre_final_courses
    const courseCodes = requested.map(r => r.course_code);

    const courses = await prisma.pre_final_courses.findMany({
      where: {
        course_code: { in: courseCodes }
      },
      orderBy: {
        course_name: 'asc'
      },
      select: {
        course_code: true,
        course_name: true
      }
    });

    // Step 3: Merge accept_reject with courses
    const courses_requested = courses.map(course => {
      const reqObj = requested.find(r => r.course_code === course.course_code);
      return {
        ...course,
        accept_reject: reqObj ? reqObj.accept_reject : null
      };
    });

    // Step 4: Send response
    res.json({
      success: true,
      count: courses_requested.length,
      courses_requested
    });

  } catch (err) {
    console.error('Error fetching requested courses:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch requested courses.',
      details: err.message
    });
  }
};
exports.pre_registered_data = async (req, res) => {
  try {
    const { iid } = req.params;
    
    // Step 1: Find all courses taught by this professor
    const professorCourses = await prisma.prof_course.findMany({
      where: { iid },
      select: { course_id: true }
    });
    
    const courseIds = professorCourses.map(c => c.course_id);
    
    if (courseIds.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No courses found for professor with iid: ${iid}`
      });
    }

    // Step 2: Get all students who pre-registered for those courses
    const students_preregistered = await prisma.student_pre_registered.findMany({
      where: {
        course_id: { in: courseIds }
      },
      include: {
        student: true // only include student info
      }
    });

    if (students_preregistered.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No pre-registered students found for professor with iid: ${iid}`
      });
    }

    // Step 3: Get course details separately
    const courseDetails = await prisma.final_courses.findMany({
      where: {
        course_id: { in: courseIds }
      },
      select: {
        course_id: true,
        course_name: true,
        course_code: true
      }
    });

    // Create a map for quick lookup
    const courseMap = courseDetails.reduce((acc, course) => {
      acc[course.course_id] = course;
      return acc;
    }, {});

    // Step 4: Combine the data
    const result = students_preregistered.map(item => ({
      ...item,
      course_name: courseMap[item.course_id]?.course_name || null,
      course_code: courseMap[item.course_id]?.course_code || null
    }));

    res.json({
      success: true,
      students_preregistered: result
    });

  } catch (err) {
    console.error('Error fetching requested students:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch requested students.',
      details: err.message
    });
  }
};

exports.logout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};