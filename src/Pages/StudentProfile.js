import React, { useState , useEffect} from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Calendar, ArrowLeft, BookOpen, 
  GraduationCap, CreditCard, Clock, AlertCircle, CheckCircle, 
  TrendingUp, School, Award, UserCheck, FileText, Edit
} from 'lucide-react';
import '../Css/StudentProfile.css';
import Sidebar from '../Components/Sidebar';
import IssueBookModal from '../Components/IssueBookModal';
const StudentProfile = () => {
  const { id } = useParams();
 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudent] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const location = useLocation();
  const [showIssueBookModal, setShowIssueBookModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [student] = useState({
    id: 1,
    regNo: "2024001",
    name: "John Doe",
    class: "X-A",
    rollNo: "101",
    section: "A",
    phoneNo: "+1234567890",
    parentPhone: "+1234567891",
    email: "john@example.com",
    address: "123 School Street, Academic District",
    joinDate: "2024-01-15",
    status: "Active",
    bloodGroup: "O+",
    dateOfBirth: "2008-05-15",
    gender: "Male",
    parentName: "Robert Doe",
    attendance: "92%",
    rank: "5",
    achievements: [
      "First Prize in Science Exhibition 2024",
      "School Sports Captain",
      "Perfect Attendance Award 2023"
    ]
  });

  const [academicDetails] = useState({
    currentYear: "2023-2024",
    semester: "2nd Semester",
    subjects: [
      { name: 'Mathematics', teacher: 'Mrs. Smith', marks: { mid: 85, final: 88, assignments: 90 }, grade: 'A' },
      { name: 'Science', teacher: 'Mr. Johnson', marks: { mid: 78, final: 82, assignments: 85 }, grade: 'B+' },
      { name: 'English', teacher: 'Ms. Williams', marks: { mid: 92, final: 95, assignments: 88 }, grade: 'A+' },
      { name: 'History', teacher: 'Mr. Davis', marks: { mid: 88, final: 85, assignments: 92 }, grade: 'A' },
      { name: 'Computer Science', teacher: 'Mrs. Wilson', marks: { mid: 95, final: 96, assignments: 98 }, grade: 'A+' }
    ],
    attendance: {
      total: 220,
      present: 202,
      absent: 18,
      late: 5,
      percentage: 92
    }
  });

  const [books] = useState([
    { 
      id: 1, 
      title: 'Physics Vol 1', 
      author: 'Robert M. Walker',
      issueDate: '2024-02-15', 
      dueDate: '2024-03-15', 
      status: 'Issued',
      fine: 0
    },
    { 
      id: 2, 
      title: 'Advanced Mathematics', 
      author: 'Sarah Johnson',
      issueDate: '2024-01-20', 
      dueDate: '2024-02-20', 
      status: 'Returned',
      fine: 50
    }
  ]);

  const [fees] = useState({
    currentDues: 2500,
    totalPaid: 47500,
    transactions: [
      { 
        term: 'Term 2', 
        amount: 25000, 
        status: 'Pending', 
        dueDate: '2024-04-01',
        type: 'Tuition Fee'
      },
      { 
        term: 'Term 1', 
        amount: 25000, 
        status: 'Paid', 
        paidDate: '2024-01-10',
        type: 'Tuition Fee'
      },
      { 
        term: 'Annual', 
        amount: 15000, 
        status: 'Paid', 
        paidDate: '2024-01-05',
        type: 'Development Fee'
      }
    ]
  });

  const getQueryParams = (param) => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get(param);
  };

  const regNo = getQueryParams('regno');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!regNo) {
        console.error('Registration number is required');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/v2/api/profile/student?regno=${regNo}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.student) {
            setStudentData(data.student);
          } else {
            console.error('Student not found');
          }
        } else {
          console.error('Failed to fetch student data', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [regNo]);

  if (!studentData) {
    return <div>Loading...</div>;
  }

  const renderOverviewTab = () => (
    <div className="overview-section">
      <Sidebar />
      <div className="overview-grid">
        <div className="stat-card">
          <div className="stat-icon attendance">
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <h4>Attendance</h4>
            <div className="stat-value">{studentData.percentageofattences}%</div>
            <div className="stat-subtitle">Present: {studentData.totalpresenntmark} days</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rank">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <h4>Class Rank</h4>
            <div className="stat-value">#{student.rank}</div>
            <div className="stat-subtitle">of {studentData.totalstudentcount} students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon books">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <h4>Library Books</h4>
            <div className="stat-value">{studentData.book_issued}</div>
            <div className="stat-subtitle">Currently Issued</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon fees">
            <CreditCard size={24} />
          </div>
          <div className="stat-content">
            <h4>Pending Fees</h4>
            <div className="stat-value">₹{studentData.total_due}</div>
            <div className="stat-subtitle">Due Amount</div>
          </div>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-card">
          <div className="card-header">
            <h3><User size={18} /> Personal Information</h3>
            <button className="edit-button"><Edit size={16} />Edit</button>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Date of Birth</span>
              <span>{student.dateOfBirth}</span>
            </div>
            <div className="info-item">
              <span className="label">Blood Group</span>
              <span>{student.bloodGroup}</span>
            </div>
            <div className="info-item">
              <span className="label">Gender</span>
              <span>{student.gender}</span>
            </div>
            <div className="info-item">
              <span className="label">Parent Name</span>
              <span>{student.parentName}</span>
            </div>
            <div className="info-item">
              <span className="label">Parent Phone</span>
              <span>{student.parentPhone}</span>
            </div>
            <div className="info-item">
              <span className="label">Address</span>
              <span>{student.address}</span>
            </div>
          </div>
        </div>

        <div className="details-card">
          <div className="card-header">
            <h3><Award size={18} /> Achievements</h3>
          </div>
          <ul className="achievements-list">
            {student.achievements.map((achievement, index) => (
              <li key={index}>
                <CheckCircle size={16} />
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderAcademicTab = () => (
    <div className="academic-section">
      <Sidebar />
      <div className="section-header">
        <div>
          <h3>Academic Performance</h3>
          <p className="subtitle">{academicDetails.currentYear} • {academicDetails.semester}</p>
        </div>
        <button className="add-button">Add Marks</button>
      </div>

      <div className="marks-cards">
        {academicDetails.subjects.map((subject, index) => (
          <div key={index} className="subject-card">
            <div className="subject-header">
              <h4>{subject.name}</h4>
              <span className="grade">{subject.grade}</span>
            </div>
            <p className="teacher">Teacher: {subject.teacher}</p>
            <div className="marks-grid">
              <div className="marks-item">
                <span>Midterm</span>
                <span>{subject.marks.mid}%</span>
              </div>
              <div className="marks-item">
                <span>Final</span>
                <span>{subject.marks.final}%</span>
              </div>
              <div className="marks-item">
                <span>Assignments</span>
                <span>{subject.marks.assignments}%</span>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ width: `${(subject.marks.final + subject.marks.mid) / 2}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="attendance-card">
        <h3>Attendance Overview</h3>
        <div className="attendance-stats">
          <div className="attendance-item">
            <div className="attendance-circle">
              <svg viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4caf50"
                  strokeWidth="3"
                  strokeDasharray={`${academicDetails.attendance.percentage}, 100`}
                />
              </svg>
              <div className="percentage">{academicDetails.attendance.percentage}%</div>
            </div>
            <div className="attendance-label">Present</div>
          </div>
          <div className="attendance-details">
            <div className="detail-item">
              <span>Total Classes</span>
              <span>{academicDetails.attendance.total}</span>
            </div>
            <div className="detail-item">
              <span>Present</span>
              <span>{academicDetails.attendance.present}</span>
            </div>
            <div className="detail-item">
              <span>Absent</span>
              <span>{academicDetails.attendance.absent}</span>
            </div>
            <div className="detail-item">
              <span>Late</span>
              <span>{academicDetails.attendance.late}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBooksTab = () => (
    <div className="books-section">
      <Sidebar />
      <div className="section-header">
        <div>
          <h3>Library Books</h3>
          <p className="subtitle">Current and Past Book Issues</p>
        </div>
        <button className="add-button" onClick={() => {setSelectedStudent(student);setShowIssueBookModal(true);}}>Issue New Book</button>
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <div className="book-status-badge"
              style={{
                backgroundColor: book.status === 'Issued' ? '#e3f2fd' : '#e8f5e9',
                color: book.status === 'Issued' ? '#1976d2' : '#2e7d32'
              }}
            >
              {book.status}
            </div>
            <h4>{book.title}</h4>
            <p className="author">By {book.author}</p>
            <div className="book-details">
              <div className="detail-row">
                <span>Issue Date</span>
                <span>{book.issueDate}</span>
              </div>
              <div className="detail-row">
                <span>Due Date</span>
                <span>{book.dueDate}</span>
              </div>
              {book.fine > 0 && (
                <div className="detail-row fine">
                  <span>Fine Due</span>
                  <span>₹{book.fine}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeesTab = () => (
    <div className="fees-section">
      <Sidebar />
      <div className="section-header">
        <div>
          <h3>Fees & Payments</h3>
          <p className="subtitle">Academic Year {academicDetails.currentYear}</p>
        </div>
        <button className="add-button">Make Payment</button>
      </div>

      <div className="fees-overview">
        <div className="fee-stat-card">
          <div className="fee-icon pending">
            <AlertCircle size={24} />
          </div>
          <div className="fee-stat-content">
            <h4>Pending Dues</h4>
            <div className="fee-amount">₹{studentData.total_due}</div>
          </div>
        </div>

        <div className="fee-stat-card">
          <div className="fee-icon paid">
            <CheckCircle size={24} />
          </div>
          <div className="fee-stat-content">
            <h4>Total Paid</h4>
            <div className="fee-amount">₹{studentData.paidbalance}</div>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <h3>Transaction History</h3>
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Term</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due/Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {fees.transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.term}</td>
                  <td>{transaction.type}</td>
                  <td>₹{transaction.amount}</td>
                  <td>
                    <span className={`status-pill ${transaction.status.toLowerCase()}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td>{transaction.paidDate || transaction.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-header-section">
        <button onClick={() => navigate('/student')} className="back-button">
          <ArrowLeft size={20} />
          Back to Students
        </button>
        
        <div className="header-content">
          <div className="student-profile-header">
            <div className="profile-avatar">
              <User size={40} />
            </div>
            <div className="profile-info">
              <div className="name-section">
                <h1>{studentData.full_name}</h1>
                <span className={`status-badge ${studentData.status.toLowerCase()}`}>
                  {studentData.status}
                </span>
              </div>
              <div className="basic-info">
                <div className="info-badge">
                  <School size={16} />
                  Class {studentData.class}
                </div>
                <div className="info-badge">
                  <GraduationCap size={16} />
                  Roll No: {studentData.roll_no}
                </div>
                <div className="info-badge">
                  <FileText size={16} />
                  Reg No: {studentData.registration_number}
                </div>
              </div>
              <div className="contact-info">
                <span><Mail size={16} />{studentData.email}</span>
                <span><Phone size={16} />{studentData.phone_number}</span>
              </div>
            </div>
          </div>
        </div>
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

      <div className="profile-content">
        <div className="tabs-container">
          <nav className="tabs-nav">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'academic', label: 'Academic', icon: GraduationCap },
              { id: 'books', label: 'Library', icon: BookOpen },
              { id: 'fees', label: 'Fees', icon: CreditCard }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`tab-button ${activeTab === id ? 'active' : ''}`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          <div className="tab-content">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'academic' && renderAcademicTab()}
            {activeTab === 'books' && renderBooksTab()}
            {activeTab === 'fees' && renderFeesTab()}
            {/* Books and Fees tabs will be continued in the next message */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;