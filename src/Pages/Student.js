'use client';
import React, { useState , useEffect} from 'react';
import {
  Search,
  UserPlus,
  MoreVertical,
  BookOpen,
  CreditCard,
  User,
  Calendar,
  FileText,
  Download
} from 'lucide-react';
import '../Css/Student.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import IssueBookModal from '../Components/IssueBookModal';

const initialStudents = [
  {
    id: 1,
    regNo: "2024001",
    name: "John Doe",
    class: "X-A",
    phoneNo: "+1234567890",
    email: "john@example.com",
    address: "123 School Street",
    joinDate: "2024-01-15",
    status: "Active"
  },
  {
    id: 2,
    regNo: "2024002",
    name: "Jane Smith",
    class: "IX-B",
    phoneNo: "+1234567891",
    email: "jane@example.com",
    address: "456 College Road",
    joinDate: "2024-01-16",
    status: "Active"
  },
  
];

export default function StudentsPage() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState();
  const [filteredStudentss, setFilteredStudents] = useState([]);
  const [showIssueBookModal, setShowIssueBookModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    regNo: "",
    class: "",
    phoneNo: "",
    email: "",
    address: "",
    joinDate: "",
    status: "Active"
  });
  const navigate = useNavigate();

  const filteredStudents = students.filter(student =>
    Object.values(student).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddStudent = async (e) => {
    e.preventDefault();
  
    
    const studentData = {
      full_name: newStudent.name,
      class_name: newStudent.class,
      phone_number: newStudent.phoneNo,
      email: newStudent.email,
      address: newStudent.address,
      join_date: newStudent.joinDate,
    };
  
    try {
      const response = await fetch('http://15.207.102.222:5000/v2/api/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert('Student added successfully!');
        console.log('New Student ID:', data.studentId); 
        setShowAddModal(false);
        setNewStudent({
          name: '',
          class: '',
          phoneNo: '',
          email: '',
          address: '',
          joinDate: '',
        });
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        alert('Failed to add student: ' + errorData.message);
      }
    } catch (error) {
      console.error('Network Error:', error.message);
      alert('Failed to connect to the server.');
    }
  };
  

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch('http://15.207.102.222:5000/v2/api/list/student', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ auth: authToken }),
        });
  
        if (response.ok) {
          const data = await response.json();
          const transformedStudents = transformStudentsData(data.students);
          setStudents(transformedStudents);
          setFilteredStudents(transformedStudents);
        } else {
          console.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
  
    fetchStudents();
  }, []);
  const transformStudentsData = (students) => {
    return students.map((student, index) => ({
      id: student.id,
      regNo: student.registration_number,
      name: student.full_name,
      class: student.class,
      phoneNo: student.phone_number,
      email: student.email,
      joinDate: new Date(student.join_date).toLocaleDateString(), 
      status: student.status,
      serial: index + 1, 
    }));
  };
    
  

  

  return (
    <div className="students-page">
      <Sidebar />
      {/* Header Section */}
      <div className="header-section">
        <div className="left-section">
          <h1>Students Management</h1>
          <p>{students.length} total students</p>
        </div>
        <button className="add-button" onClick={() => setShowAddModal(true)}>
          <UserPlus size={20} />
          Add New Student
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="search-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button className="export-button">
            <Download size={18} />
            Export List
          </button>
        </div>
      </div>

      {/* Students Table */}
<div className="table-container">
  <table className="students-table">
    <thead>
      <tr>
        <th>S.No</th>
        <th>Reg. No</th>
        <th>Name</th>
        <th>Class</th>
        <th>Phone No</th>
        <th>Email</th>
        <th>Join Date</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredStudentss.length > 0 ? (
        filteredStudentss.map((student) => (
          <tr key={student.id}>
            <td>{student.serial}</td>
            <td>{student.regNo}</td>
            <td>{student.name}</td>
            <td>{student.class}</td>
            <td>{student.phoneNo}</td>
            <td>{student.email}</td>
            <td>{student.joinDate}</td>
            <td>
              <span className={`status-badge ${student.status.toLowerCase()}`}>
                {student.status}
              </span>
            </td>
            <td className="actions-cell">
              <div className="actions-wrapper">
                <button
                  className="action-button"
                  onClick={() => setShowActionMenu(showActionMenu === student.id ? null : student.id)}
                >
                  <MoreVertical size={18} />
                </button>
                {showActionMenu === student.id && (
                  <div className="action-menu">
                    <button onClick={() => navigate(`/profile/?regno=${student.regNo}`)}>
                      <User size={16} />
                      View Profile
                    </button>
                    <button onClick={() => {setSelectedStudent(student);setShowIssueBookModal(true);}}>
                      <BookOpen size={16} />
                      Issue Book
                    </button>
                    <button onClick={() => navigate(`/profile/?regno=${student.regNo}`)}>
                      <CreditCard size={16} />
                      Fee Details
                    </button>
                    <button onClick={() => navigate(`/attendence`)}>
                      <Calendar size={16} />
                      Attendance
                    </button>
                    <button onClick={() => navigate(`/profile/?regno=${student.regNo}`)}>
                      <FileText size={16} />
                      Reports
                    </button>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="9" style={{ textAlign: 'center' }}>
            No students available.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{showIssueBookModal && selectedStudent && (
        <IssueBookModal
          student={selectedStudent}
          isOpen={showIssueBookModal}
          onClose={() => {
            setShowIssueBookModal(false);
            setSelectedStudent(null);
          }}
        />
      )}


      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Student</h2>
              <button onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddStudent}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  />
                </div>
                {/* <div className="form-group">
                  <label>Registration Number</label>
                  <input
                    type="text"
                    required
                    value={newStudent.regNo}
                    onChange={(e) => setNewStudent({...newStudent, regNo: e.target.value})}
                  />
                </div> */}
                <div className="form-group">
                  <label>Class</label>
                  <input
                    type="text"
                    required
                    value={newStudent.class}
                    onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newStudent.phoneNo}
                    onChange={(e) => setNewStudent({...newStudent, phoneNo: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    required
                    value={newStudent.address}
                    onChange={(e) => setNewStudent({...newStudent, address: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Join Date</label>
                  <input
                    type="date"
                    required
                    value={newStudent.joinDate}
                    onChange={(e) => setNewStudent({...newStudent, joinDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className='cancel-btn' onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="submit-button">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}