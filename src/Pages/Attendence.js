import React, { useState, useEffect } from 'react';
import { Calendar, Users, UserCheck, UserX, Check } from 'lucide-react';
import '../Css/Attendence.css';
import Sidebar from '../Components/Sidebar';

const AttendancePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://15.207.102.222:5000/v2/api/attendence/list');
        const data = await response.json();
        // Ensure each student has a 'present' property initialized to false
        setStudents(data.students.map(student => ({
          ...student,
          present: false
        })));
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const toggleAttendance = (rollNo) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.roll_no === rollNo 
          ? { ...student, present: !student.present }
          : student
      )
    );
  };

  const handleSelectAll = (status) => {
    setStudents(prevStudents => 
      prevStudents.map(student => ({
        ...student,
        present: status
      }))
    );
  };

  const getPresentCount = () => students.filter(s => s.present).length;
  const getAbsentCount = () => students.filter(s => !s.present).length;

  const handleSubmit = async () => {
    try {
      const attendanceData = students.map(student => ({
        roll_no: student.roll_no,
        date: currentDate,
        present: student.present ? 1 : 0, 
      }));

      const response = await fetch('http://15.207.102.222:5000/update-attendance', {
        method: 'POST',  
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });

      if (response.ok) {
        setSubmitted(true);
        alert('Attendance updated successfully!');
      } else {
        const result = await response.json();
        alert(`Failed to update attendance: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('An error occurred while submitting attendance.');
    }
  };

  return (
    <div className="attendance-page">
      <Sidebar />
      <div className="header-section">
        <div className="header-left">
          <h1>Mark Attendance</h1>
          <p>Total Students: {students.length}</p>
        </div>
        <div className="date-picker">
          <Calendar className="calendar-icon" />
          <input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
          />
        </div>
      </div>

      <div className="page-layout">
        {/* Attendance Marking Section */}
        <div className="attendance-container">
          <div className="attendance-controls">
            <button onClick={() => handleSelectAll(true)}>Select All Present</button>
            <button onClick={() => handleSelectAll(false)}>Select All Absent</button>
          </div>
          <div className="attendance-scroll">
            <div className="attendance-row">
              {students.map((student) => (
                <div key={student.roll_no} className={`student-card ${!student.present ? 'absent' : ''}`}>
                  <div className="card-content">
                    <div className="attendance-status">
                      <span className={`status-indicator ${student.present ? 'present' : 'absent'}`}>
                        {student.present ? 'Present' : 'Absent'}
                      </span>
                    </div>
                    <div className="student-details">
                      <h3>{student.full_name}</h3>
                      <p className="roll-no">Roll No: {student.roll_no}</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={student.present}
                        onChange={() => toggleAttendance(student.roll_no)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="summary-section">
          <div className="summary-cards">
            <div className="summary-card total">
              <Users size={24} />
              <h3>Total</h3>
              <p>{students.length}</p>
            </div>
            <div className="summary-card present">
              <UserCheck size={24} />
              <h3>Present</h3>
              <p>{getPresentCount()}</p>
            </div>
            <div className="summary-card absent">
              <UserX size={24} />
              <h3>Absent</h3>
              <p>{getAbsentCount()}</p>
            </div>
          </div>

          {getAbsentCount() > 0 && (
            <div className="absent-list">
              <h3>Absent Students</h3>
              <div className="absent-students">
                {students.filter(s => !s.present).map(student => (
                  <div key={student.roll_no} className="absent-student">
                    <UserX className="absent-icon" />
                    <span>{student.full_name}</span>
                    <span className="roll-number">({student.roll_no})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            className={`submit-button ${submitted ? 'submitted' : ''}`}
            onClick={handleSubmit}
            disabled={submitted}
          >
            <Check className="submit-icon" />
            {submitted ? 'Attendance Submitted' : 'Submit Attendance'}
          </button>

          {submitted && (
            <div className="success-alert">
              Attendance has been successfully marked for {currentDate}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;