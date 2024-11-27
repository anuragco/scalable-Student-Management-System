require("dotenv").config();
const express = require("express");
const port = 5000;
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { exec } = require('child_process');
const verifyAuth = require('./Middleware/Verifyadmin');
const path = require('path');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get("/api/test", (req, res) => {
  res.send("hello");
});

const pool = mysql.createPool({
  host: "database-1.c76ew6kw8abd.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "123#sinGH#",
  port: 3306,
  database: "studentmanagement",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

app.post("/v2/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send(400).json({ message: "All fields must be provided" });
  }

  const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";

  pool.query(sql, [email, password], (err, results) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Internal Server Error", error: err.message });
    }

    if (results.length > 0) {
      const user = results[0];
      const userid = user.id;

      const token = jwt.sign(
        { userid, email: user.email },
        process.env.jwtsecret,
        { expiresIn: "1h" }
      );

      const uuidtoken = uuidv4();

      const tokensql = "UPDATE admin SET auth = ?";

      pool.query(tokensql, [uuidtoken], (err, res) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "Internal Server Error", error: err.message });
        }
      });
      return res.status(200).json({
        message: "Login sucessfully",
        token: uuidtoken,
        jwt: token,
      });
    } else {
      return res.status(404).json({ message: "Check Your Email And Password" });
    }
  });
});

function generateRegistrationNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}
function generaterollno() {
  const rollcode = Math.floor(100000 + Math.random() * 900000);
  return "D2406" + rollcode;
}

app.post("/v2/api/student", (req, res) => {
  const { full_name, class_name, phone_number, email, address, join_date } =
    req.body;

  if (
    !full_name ||
    !class_name ||
    !phone_number ||
    !email ||
    !address ||
    !join_date
  ) {
    return res.status(400).json({ message: "All fields must be provided" });
  }

  const registration_number = generateRegistrationNumber();
  const actualrollno = generaterollno();

  const sql = `INSERT INTO students (full_name, registration_number, class, phone_number, email, address, join_date, status , roll_no)
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?)`;
  pool.query(
    sql,
    [
      full_name,
      registration_number,
      class_name,
      phone_number,
      email,
      address,
      join_date,
      actualrollno,
    ],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }
      return res.status(201).json({
        message: "Student registered successfully",
        registration_number: registration_number,
        student_id: results.insertId,
      });
    }
  );
});

app.get("/v2/api/profile/student",  (req, res) => {
  const { regno } = req.query;

  if (!regno) {
    return res
      .status(400)
      .json({ message: "Registration number (regno) is required" });
  }

  const sql = "SELECT * FROM students WHERE registration_number = ?";

  const totalduesql = `SELECT id, (total_due - paid) AS remaining_due FROM fee_details WHERE id = ?;`
  const totalpaid = "SELECT paid FROM fee_details WHERE id = ?"
  
  const presentsql = "SELECT COUNT(present) AS total_present FROM attendance WHERE present=1 AND roll_no=?;"
  const totalattencemark = "SELECT COUNT(present) AS totalmarkattendence FROM attendance WHERE roll_no=?;"
  const totalmeberstudent  = "SELECT COUNT(registration_number) AS total_studentc FROM students;"
  const bookissuecount = "SELECT COUNT(book_id) AS book_issued FROM book_issues WHERE student_id=?;"

  pool.query(sql, [regno], (err, studentResult) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database error", error: err.message });
    }

    if (studentResult.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    const student = studentResult[0];
    const ids = studentResult[0].id;
    const rollnumber = studentResult[0].roll_no;

     pool.query(totalduesql,[ids] ,(err, feeResults) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }
      const totalDue =  feeResults.length > 0 ? feeResults[0].remaining_due : null;


      if(totalDue == null) {
        student.total_due= 0;
      }else{
        student.total_due = totalDue;
      }


      pool.query(totalpaid, [ids], (err, totalpaidResults) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err.message });
        }
  
        if (totalpaidResults.length === 0) {
          student.paidbalance = 0; 
        } else {
          student.paidbalance = totalpaidResults[0].paid;
        }
       


        pool.query(presentsql ,[rollnumber], (err , totalpresnnt)=>{
          if (err) {
            return res
              .status(500)
              .json({ message: "Database error", error: err.message });
          }

          const totalpresenntmark = totalpresnnt[0].total_present;

          pool.query(totalattencemark, [rollnumber], (err, overallmark)=>{
            if (err) {
              return res
                .status(500)
                .json({ message: "Database error", error: err.message });
            }

            const overallattrence = overallmark[0].totalmarkattendence;

           let percentageofattences = 0;
            if (overallattrence > 0) {
              const stdhgh = (totalpresenntmark / overallattrence) * 100;
              percentageofattences = stdhgh.toFixed(2);
            }

            
            student.percentageofattences = percentageofattences;

            if(totalpresenntmark == null ){
              student.totalpresenntmark=0
            }else{

              student.totalpresenntmark= totalpresenntmark;
            }

            pool.query(totalmeberstudent, (err, totalcountofstd) => {
              if (err) {
                return res
                  .status(500)
                  .json({ message: "Database error", error: err.message });
              }


              const totalstudentcoufh= totalcountofstd[0].total_studentc;

              student.totalstudentcount = totalstudentcoufh;
                         

                          pool.query(bookissuecount, [ids], (err, issuedbooks) => {
                            if (err) {
                              return res
                                .status(500)
                                .json({ message: "Database error", error: err.message });
                            }

                            const bookissuedgh = issuedbooks[0].book_issued;
                              
                            if(bookissuedgh == null){
                              student.book_issued = 0
                            }else{
                              student.book_issued=bookissuedgh;
                            }

                              return res.status(200).json({ student });
                          })

            })

          });

        })
      })
      
    })

    

  });
});

app.post("/update-attendance", (req, res) => {
  const attendanceData = req.body;

  if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
    return res.status(400).json({ message: "Invalid or empty attendance data" });
  }

  const placeholders = attendanceData.map(() => "(?, ?, ?)").join(", ");
  const query = `
    INSERT INTO attendance (roll_no, date, present)
    VALUES ${placeholders}
    ON DUPLICATE KEY UPDATE present = VALUES(present)
  `;

  const values = attendanceData.flatMap(({ roll_no, date, present }) => [
    roll_no,
    date,
    present ? 1 : 0 
  ]);

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating attendance:", err);
      return res.status(500).json({ message: "Error updating attendance" });
    }

    return res.status(200).json({ message: "Attendance updated successfully" });
  });
});
  
  app.post("/v2/api/list/student", (req, res) => {
  const { auth } = req.body;

  if (!auth) {
    return res.status(403).json({ message: "All Fields Required" });
  }

  const sql = "SELECT * FROM admin WHERE auth = ?";

  pool.query(sql, [auth], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (results.length > 0) {
      const sqlstudent = "SELECT * FROM students ";

      pool.query(sqlstudent, (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Internal Server Error" });
        }
        res.status(200).json({ students: results });
      });
    } else {
      return res.status(401).json({ message: " Unauthorized" });
    }
  });
});

app.get("/v2/api/attendence/list", (req, res) => {
  const sql = "SELECT roll_no , full_name FROM students ";

  pool.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.status(200).json({ students: results });
  });
});

app.post("/api/books", (req, res) => {
  const {
    isbn,
    title,
    author,
    category,
    quantity,
    available,
    publisher,
    publish_year,
    location,
  } = req.body;

  const query = `INSERT INTO books (isbn, title, author, category, quantity, available, publisher, publish_year, location) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  pool.query(
    query,
    [
      isbn,
      title,
      author,
      category,
      quantity,
      available,
      publisher,
      publish_year,
      location,
    ],
    (err, result) => {
      if (err) {
        console.error("Error adding book:", err);
        return res.status(500).json({ message: "Error adding book" });
      }

      const actionQuery = `INSERT INTO actions (book_id, action, performed_by) 
                           VALUES (?, 'Added', ?)`;

      const bookId = result.insertId;
      const performedBy = "Admin";

      pool.query(actionQuery, [bookId, performedBy], (err, result) => {
        if (err) {
          console.error("Error logging action:", err);
          return res.status(500).json({ message: "Error logging action" });
        }

        res.status(201).json({ message: "Book added successfully", bookId });
      });
    }
  );
});

app.get("/api/books", (req, res) => {
  const query = "SELECT * FROM books";

  pool.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching books:", err);
      return res.status(500).json({ message: "Error fetching books" });
    }

    res.status(200).json(result);
  });
});

app.put("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  const {
    isbn,
    title,
    author,
    category,
    quantity,
    available,
    publisher,
    publish_year,
    location,
  } = req.body;

  const query = `UPDATE books SET isbn = ?, title = ?, author = ?, category = ?, quantity = ?, 
                   available = ?, publisher = ?, publish_year = ?, location = ? 
                   WHERE id = ?`;

  pool.query(
    query,
    [
      isbn,
      title,
      author,
      category,
      quantity,
      available,
      publisher,
      publish_year,
      location,
      bookId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating book:", err);
        return res.status(500).json({ message: "Error updating book" });
      }

      const actionQuery = `INSERT INTO actions (book_id, action, performed_by) 
                           VALUES (?, 'Updated', ?)`;

      const performedBy = "Admin";

      pool.query(actionQuery, [bookId, performedBy], (err, result) => {
        if (err) {
          console.error("Error logging action:", err);
          return res.status(500).json({ message: "Error logging action" });
        }

        res.status(200).json({ message: "Book updated successfully" });
      });
    }
  );
});

app.delete("/api/books/:id", (req, res) => {
  const bookId = req.params.id;

  const query = `DELETE FROM books WHERE id = ?`;

  pool.query(query, [bookId], (err, result) => {
    if (err) {
      console.error("Error deleting book:", err);
      return res.status(500).json({ message: "Error deleting book" });
    }

    const actionQuery = `INSERT INTO actions (book_id, action, performed_by) 
                           VALUES (?, 'Deleted', ?)`;

    const performedBy = "Admin";

    pool.query(actionQuery, [bookId, performedBy], (err, result) => {
      if (err) {
        console.error("Error logging action:", err);
        return res.status(500).json({ message: "Error logging action" });
      }

      res.status(200).json({ message: "Book deleted successfully" });
    });
  });
});

app.get("/v2/api/details", verifyAuth, (req, res) => {
  try {
    const totalstusql = "SELECT * FROM students";
    const totalsbooksql = "SELECT * FROM books";
    const attencesql = "SELECT * FROM attendance";
    const presentCountSql =
      "SELECT COUNT(*) as present_count FROM attendance WHERE present = 1";
    const absentCountSql =
      "SELECT COUNT(*) as absent_count FROM attendance WHERE present = 0";
      const paymentCollectedsql = "SELECT SUM(paid) as Total_payment FROM fee_details;"

    const alldatas = {};

    pool.query(totalstusql, (err, results) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (results.length > 0) {
        alldatas.totalstudent = results.length;
      }

      pool.query(totalsbooksql, (err, results) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        if (results.length > 0) {
          alldatas.totalbooks = results.length;
        }

        pool.query(attencesql, (err, attendanceResults) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }

          alldatas.attendance = {
            total: attendanceResults.length,
          };
        pool.query(paymentCollectedsql, (err, paymentCollectedsql) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }

          alldatas.paymentCollected = {
            total: paymentCollectedsql,
          };

          pool.query(presentCountSql, (err, presentResults) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            }

            const presentCount = presentResults[0].present_count;

            pool.query(absentCountSql, (err, absentResults) => {
              if (err) {
                return res.status(500).json({ message: err.message });
              }

              const absentCount = absentResults[0].absent_count;
              const total = presentCount + absentCount;

              alldatas.attendance = {
                total: total,
                present: presentCount,
                absent: absentCount,
                presentRatio: ((presentCount / total) * 100).toFixed(2) + "%",
                absentRatio: ((absentCount / total) * 100).toFixed(2) + "%",
              };

              res.json(alldatas);
            });
          });
        });
      });
    });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get("/v2/api/details", (req, res) => {
  try {
    pool.query("SELECT COUNT(*) as present_count FROM attendance WHERE present = 1", 
      (err, presentResults) => {
        if (err) return res.status(500).json({ message: err.message });
        
        const presentCount = presentResults[0].present_count;

        pool.query("SELECT COUNT(*) as total_count FROM attendance", 
          (err, totalResults) => {
            if (err) return res.status(500).json({ message: err.message });
            
            const totalCount = totalResults[0].total_count;

            // Use C program 
            exec(`../HOF/student_calc attendance ${totalCount} ${presentCount}`, 
              (error, stdout) => {
                if (error) {
                  console.error('Error:', error);
                  return res.status(500).json({ message: "Error calculating attendance" });
                }

                try {
                  const attendanceData = JSON.parse(stdout);
                  res.status(200).json(attendanceData);
                } catch (e) {
                  res.status(500).json({ message: "Error parsing attendance data" });
                }
            });
        });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post("/v2/api/calculate-grade", (req, res) => {
  const { marks } = req.body;

  if (marks === undefined || marks < 0 || marks > 100) {
    return res.status(400).json({ message: "Invalid marks" });
  }

  // Use C program for grade calculation
  exec(`../HOF/student_calc grade ${marks}`, (error, stdout) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: "Error calculating grade" });
    }

    try {
      const gradeData = JSON.parse(stdout);
      res.status(200).json(gradeData);
    } catch (e) {
      res.status(500).json({ message: "Error parsing grade data" });
    }
  });
});



app.get('/v2/api/payment/due', (req, res) => {
    const sql = `
        SELECT 
            fd.*,
            s.full_name,
            s.roll_no
        FROM fee_details fd
        LEFT JOIN students s ON fd.id = s.id
    `;

    pool.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error fetching payment details',
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            data: results
        });
    });
});


app.put('/v2/api/payment/update/:id', (req, res) => {
  const { id } = req.params;
  const { amount_paid } = req.body;

  const sql = `
      UPDATE fee_details 
      SET 
          paid = paid + ?,
          status = CASE 
              WHEN (paid + ?) >= total_due THEN 'paid'
              WHEN (paid + ?) > 0 THEN 'partial'
              ELSE 'pending'
          END
      WHERE id = ?
  `;

  pool.query(sql, [amount_paid, amount_paid, amount_paid, id], (err, result) => {
      if (err) {
          return res.status(500).json({
              success: false,
              message: 'Error updating payment',
              error: err.message
          });
      }

      return res.status(200).json({
          success: true,
          message: 'Payment updated successfully'
      });
  });
});

app.post('/v2/api/payment/assign-due/:id', (req, res) => {
  const { id } = req.params;
  const { tuition_fee, library_fee, laboratory_fee } = req.body;

  const sql = `
    UPDATE fee_details 
    SET 
        tuition_fee = tuition_fee + ?,
        library_fee = library_fee + ?,
        laboratory_fee = laboratory_fee + ?,
        total_due = total_due + ? + ? + ?,
        status = CASE 
            WHEN paid >= (total_due + ? + ? + ?) THEN 'paid'
            WHEN paid > 0 THEN 'partial'
            ELSE 'pending'
        END
    WHERE id = ?
  `;

  const totalNewDue = tuition_fee + library_fee + laboratory_fee;

  pool.query(
    sql, 
    [
      tuition_fee, library_fee, laboratory_fee,
      tuition_fee, library_fee, laboratory_fee,
      tuition_fee, library_fee, laboratory_fee,
      id
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error assigning due amount',
          error: err.message
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Due amount assigned successfully'
      });
    }
  );
});


// Search students endpoint
app.get('/v2/api/students/search', (req, res) => {
  const { query } = req.query;
  
  const sql = `
    SELECT s.* 
    FROM students s 
    LEFT JOIN fee_details f ON s.id = f.student_id
    WHERE (s.full_name LIKE ? OR s.roll_no LIKE ?)
    AND f.id IS NULL  
    LIMIT 10
  `;

  const searchQuery = `%${query}%`;
  
  pool.query(sql, [searchQuery, searchQuery], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error searching students',
        error: err.message
      });
    }

    return res.status(200).json({
      success: true,
      data: results
    });
  });
});

// Assign new fee endpoint
app.post('/v2/api/payment/assign-new-fee', (req, res) => {
  const { student_id, tuition_fee, library_fee, laboratory_fee } = req.body;
  
  const total_due = tuition_fee + library_fee + laboratory_fee;
  
  const sql = `
    INSERT INTO fee_details (
      student_id, 
      tuition_fee, 
      library_fee, 
      laboratory_fee, 
      total_due,
      paid,
      status,
      due_date
    ) VALUES (?, ?, ?, ?, ?, 0, 'pending', DATE_ADD(CURRENT_DATE, INTERVAL 1 MONTH))
  `;

  pool.query(
    sql, 
    [student_id, tuition_fee, library_fee, laboratory_fee, total_due],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error assigning fee',
          error: err.message
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Fee assigned successfully'
      });
    }
  );
});





app.get('/v2/api/list/books', async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        isbn,
        title,
        author,
        category,
        available,
        publisher,
        publish_year,
        location
      FROM books 
      WHERE available > 0
      ORDER BY title ASC
    `;

    pool.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching books:', error);
        return res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }

      res.json({
        success: true,
        books: results.map(book => ({
          id: book.id,
          isbn: book.isbn,
          title: book.title,
          author: book.author,
          category: book.category,
          availableCopies: book.available,
          publisher: book.publisher,
          publishYear: book.publish_year,
          location: book.location
        }))
      });
    });
  } catch (error) {
    console.error('Error in book fetch:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/v2/api/issue/books', async (req, res) => {
  try {
    const { studentId, bookIds, issueDate } = req.body;

    if (!studentId || !bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data'
      });
    }

    // Promisify query for student check
    const checkStudent = () => {
      return new Promise((resolve, reject) => {
        pool.query('SELECT id FROM students WHERE id = ?', [studentId], (error, results) => {
          if (error) reject(error);
          resolve(results);
        });
      });
    };

    // Promisify query for book availability check
    const checkBookAvailability = () => {
      return new Promise((resolve, reject) => {
        pool.query('SELECT id, available FROM books WHERE id IN (?) AND available > 0', [bookIds], (error, results) => {
          if (error) reject(error);
          resolve(results);
        });
      });
    };

    const students = await checkStudent();
    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const availableBooks = await checkBookAvailability();
    if (availableBooks.length !== bookIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more books are not available'
      });
    }

    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 14);

    for (const bookId of bookIds) {
      // Promisify insert and update queries
      await new Promise((resolve, reject) => {
        pool.query(
          `INSERT INTO book_issues (
            student_id,
            book_id,
            issue_date,
            due_date,
            status
          ) VALUES (?, ?, ?, ?, 'issued')`,
          [studentId, bookId, new Date(issueDate), dueDate],
          (error) => {
            if (error) reject(error);
            resolve();
          }
        );
      });

      await new Promise((resolve, reject) => {
        pool.query(
          'UPDATE books SET available = available - 1 WHERE id = ?',
          [bookId],
          (error) => {
            if (error) reject(error);
            resolve();
          }
        );
      });
    }

    res.json({
      success: true,
      message: 'Books issued successfully'
    });

  } catch (error) {
    console.error('Error issuing books:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/v2/api/student/:studentId/issued-books', async (req, res) => {
  try {
    const { studentId } = req.params;

    const query = `
      SELECT 
        bi.id as issue_id,
        b.id as book_id,
        b.title,
        b.author,
        b.isbn,
        bi.issue_date,
        bi.due_date,
        bi.status
      FROM book_issues bi
      JOIN books b ON bi.book_id = b.id
      WHERE bi.student_id = ? AND bi.status = 'issued'
      ORDER BY bi.issue_date DESC
    `;

    pool.query(query, [studentId], (error, results) => {
      if (error) {
        console.error('Error fetching issued books:', error);
        return res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }

      res.json({
        success: true,
        issuedBooks: results.map(book => ({
          issueId: book.issue_id,
          bookId: book.book_id,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          issueDate: book.issue_date,
          dueDate: book.due_date,
          status: book.status
        }))
      });
    });

  } catch (error) {
    console.error('Error in issued books fetch:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/v2/api/return/books', async (req, res) => {
  try {
    const { issueIds, returnUrl } = req.body;

    console.log('Received body:', req.body); 

    if (!issueIds || !Array.isArray(issueIds)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data'
      });
    }

    const returnDate = new Date();
    const returnedBooks = [];
    
    for (const issueId of issueIds) {
      const [issueRecords] = await pool.query(
        'SELECT book_id, student_id FROM book_issues WHERE id = ?',
        [issueId]
      );

      if (issueRecords.length > 0) {
        const bookId = issueRecords[0].book_id;
        const studentId = issueRecords[0].student_id;

        await pool.query(
          `UPDATE book_issues 
           SET status = 'returned', 
           return_date = ?, 
           late_fee = CASE 
             WHEN return_date > due_date THEN DATEDIFF(return_date, due_date) * 10 
             ELSE 0 
           END
           WHERE id = ?`,
          [returnDate, issueId]
        );

        await pool.query(
          'UPDATE books SET available = available + 1 WHERE id = ?',
          [bookId]
        );

        const [bookDetails] = await pool.query(
          'SELECT title, author FROM books WHERE id = ?',
          [bookId]
        );

        returnedBooks.push({
          bookId,
          studentId,
          title: bookDetails[0].title,
          author: bookDetails[0].author
        });
      }
    }

    res.json({
      success: true,
      message: 'Books returned successfully',
      returnedBooks,
      returnUrl: returnUrl || '/dashboard'
    });

  } catch (error) {
    console.error('Error returning books:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

const STUDENT_GRADER_PATH = path.join(
  'C:', 
  'Users', 
  'anura', 
  'Downloads', 
  'Student-management', 
  'app', 
  'src', 
  'HOF', 
  'Studentgrader.exe'
);

// Helper function to parse student report
const parseStudentReport = (stdout) => {
  const lines = stdout.split('\r\n').filter(line => line.trim() !== '');
  
  const subjectMarks = lines
    .filter(line => line.startsWith('Subject'))
    .map(line => {
      // Add more flexible regex matching with optional whitespace
      const match = line.match(/Subject\s*(\d+)\s*:\s*(\d+\.\d+)\s*\((\w+)\)/);
      
      // Add null check and provide default values
      if (!match) {
        console.error('Failed to parse subject line:', line);
        return {
          subject: null,
          marks: null,
          status: null
        };
      }
      
      return {
        subject: parseInt(match[1]),
        marks: parseFloat(match[2]),
        status: match[3]
      };
    });

  const performanceMatch = lines.find(line => line.startsWith('Total Marks:'));
  const percentageMatch = lines.find(line => line.startsWith('Percentage:'));
  const gradeMatch = lines.find(line => line.startsWith('Grade:'));
  const resultMatch = lines.find(line => line.startsWith('Result:'));
  const nameMatch = lines.find(line => line.startsWith('Name:'));
  const rollNumberMatch = lines.find(line => line.startsWith('Roll Number:'));

  return {
    name: nameMatch ? nameMatch.replace('Name: ', '') : null,
    rollNumber: rollNumberMatch ? parseInt(rollNumberMatch.replace('Roll Number: ', '')) : null,
    subjectMarks,
    totalMarks: performanceMatch 
      ? parseFloat(performanceMatch.split(': ')[1].split(' /')[0]) 
      : null,
    maxMarks: 500,
    percentage: percentageMatch 
      ? parseFloat(percentageMatch.split(': ')[1].replace('%', '')) 
      : null,
    grade: gradeMatch ? gradeMatch.split(': ')[1] : null,
    result: resultMatch ? resultMatch.split(': ')[1] : null
  };
};

// Single student grading endpoint
app.post('/grade-student', (req, res) => {
  const { name, rollNumber, marks } = req.body;

  // Input validation
  if (!name || !rollNumber || !marks || marks.length !== 5) {
    return res.status(400).json({
      error: 'Invalid input. Provide name, roll number, and 5 subject marks.'
    });
  }

  // Validate marks are numbers and within valid range
  const validMarks = marks.every(mark => 
    typeof mark === 'number' && mark >= 0 && mark <= 100
  );

  if (!validMarks) {
    return res.status(400).json({
      error: 'Marks must be numbers between 0 and 100'
    });
  }

  // Prepare command arguments
  const args = [
    `"${name}"`, 
    rollNumber.toString(), 
    ...marks.map(mark => mark.toString())
  ];

  // Execute the StudentGrader program
  exec(`"${STUDENT_GRADER_PATH}" ${args.join(' ')}`, (error, stdout, stderr) => {
    if (error) {
      console.error('Execution error:', error);
      return res.status(500).json({
        error: 'Failed to process student grades',
        details: error.message
      });
    }

    if (stderr) {
      console.error('Stderr:', stderr);
      return res.status(500).json({
        error: 'Error in grade processing',
        details: stderr
      });
    }

    // Parse and return the result
    try {
      const studentReport = parseStudentReport(stdout);
      res.json({
        message: 'Student Grading Complete',
        studentReport
      });
    } catch (parseError) {
      console.error('Report parsing error:', parseError);
      res.status(500).json({
        error: 'Failed to parse student report',
        details: parseError.message
      });
    }
  });
});

// Batch grading endpoint
app.post('/grade-students', async (req, res) => {
  const { students } = req.body;

  if (!students || !Array.isArray(students) || students.length === 0) {
    return res.status(400).json({
      error: 'Provide an array of students with their marks'
    });
  }

  try {
    const batchResults = [];

    for (const student of students) {
      try {
        // Validate individual student input
        if (!student.name || !student.rollNumber || !student.marks || student.marks.length !== 5) {
          batchResults.push({
            name: student.name,
            rollNumber: student.rollNumber,
            error: 'Invalid student data'
          });
          continue;
        }

        const result = await new Promise((resolve, reject) => {
          const args = [
            `"${student.name}"`, 
            student.rollNumber.toString(), 
            ...student.marks.map(mark => mark.toString())
          ];

          exec(`"${STUDENT_GRADER_PATH}" ${args.join(' ')}`, (error, stdout, stderr) => {
            if (error || stderr) {
              reject(error || new Error(stderr));
              return;
            }
            
            try {
              const studentReport = parseStudentReport(stdout);
              resolve({
                name: student.name,
                rollNumber: student.rollNumber,
                studentReport
              });
            } catch (parseError) {
              reject(new Error('Failed to parse student report'));
            }
          });
        });

        batchResults.push(result);
      } catch (studentError) {
        batchResults.push({
          name: student.name,
          rollNumber: student.rollNumber,
          error: studentError.message
        });
      }
    }

    res.json({
      message: 'Batch Grading Complete',
      results: batchResults
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to process batch grades',
      details: error.message
    });
  }
});


app.get('/test',  (req, res)=> {
  const sql = "SELECT * FROM students "

  pool.query(sql, (err,results)=>{
    if(err) {
      return res.status(500).json({error: err.message});
    }
    res.status(200).json({results: results});
  })
})
app.listen(port, () => {
  console.log("listening on port 5000");
});
