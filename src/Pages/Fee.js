import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Clock,
  Check,
  Plus,
  UserPlus,
} from 'lucide-react';
import axios from 'axios';
import PaymentModal from '../HOF/PaymentModal';
import AssignDueModal from '../HOF/AssignDueModal';
import AssignStudentFeeModal from '../HOF/AssignStudentFeeModal';
import Sidebar from '../Components/Sidebar';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
    {children}
  </div>
);

const FeePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignDueModal, setShowAssignDueModal] = useState(false);
  const [showAssignStudentFeeModal, setShowAssignStudentFeeModal] = useState(false);

  useEffect(() => {
    fetchFeeDetails();
  }, []);

  const fetchFeeDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/v2/api/payment/due');
      
      const transformedData = response.data.data.map(item => ({
        id: item.id,
        rollNo: item.roll_no,
        name: item.full_name,
        class: "N/A",
        feeDetails: {
          tuitionFee: item.tuition_fee,
          libraryFee: item.library_fee,
          laboratoryFee: item.laboratory_fee,
          totalDue: item.total_due,
          paid: item.paid,
          dueDate: new Date(item.due_date).toLocaleDateString(),
          status: item.status
        }
      }));

      setStudents(transformedData);
    } catch (err) {
      setError('Failed to fetch fee details');
      console.error('Error fetching fee details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    fetchFeeDetails();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'partial': return 'Partially Paid';
      case 'pending': return 'Payment Pending';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Fee Management</h1>
          <p className="text-gray-600">View and manage student fees</p>
        </div>
        <div className="flex items-center gap-2">
        <button
            onClick={() => setShowAssignStudentFeeModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <UserPlus size={16} />
            Assign New Student Fee
          </button>
          <Calendar className="text-gray-500" size={20} />
          <select 
            className="border rounded-md p-2"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="2024-01">January 2024</option>
            <option value="2024-02">February 2024</option>
            <option value="2024-03">March 2024</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Sidebar />
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Total Students</h3>
            <DollarSign className="text-gray-500" size={20} />
          </div>
          <div className="text-2xl font-bold">{students.length}</div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Fees Collected</h3>
            <CreditCard className="text-green-500" size={20} />
          </div>
          <div className="text-2xl font-bold">
            ₹{students.reduce((sum, student) => sum + student.feeDetails.paid, 0)}
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Pending Fees</h3>
            <Clock className="text-red-500" size={20} />
          </div>
          <div className="text-2xl font-bold">
            ₹{students.reduce((sum, student) => 
              sum + (student.feeDetails.totalDue - student.feeDetails.paid), 0)}
          </div>
        </Card>
      </div>

      {/* Student Fee List */}
      <Card className="mt-6">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold">Student Fee Details</h2>
          <button
            onClick={() => {
              if (selectedStudent) {
                setShowAssignDueModal(true);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300"
            disabled={!selectedStudent}
          >
            <Plus size={16} />
            Assign Due
          </button>
        </div>
        <div className="divide-y">
          {students.map((student) => (
            <div 
              key={student.id} 
              className="py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-medium">{student.name}</h3>
                    <p className="text-sm text-gray-500">Roll No: {student.rollNo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">₹{student.feeDetails.totalDue}</p>
                    <p className="text-sm text-gray-500">Total Fee</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{student.feeDetails.paid}</p>
                    <p className="text-sm text-gray-500">Paid Amount</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(student.feeDetails.status)}`}>
                      {getStatusText(student.feeDetails.status)}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowPaymentForm(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Details Modal */}
      {showPaymentForm && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Payment Details</h2>
              <button 
                onClick={() => setShowPaymentForm(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="font-medium">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Roll Number</p>
                  <p className="font-medium">{selectedStudent.rollNo}</p>
                </div>
              </div>

              <Card>
                <h3 className="font-medium mb-2">Fee Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tuition Fee</span>
                    <span>₹{selectedStudent.feeDetails.tuitionFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Library Fee</span>
                    <span>₹{selectedStudent.feeDetails.libraryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Laboratory Fee</span>
                    <span>₹{selectedStudent.feeDetails.laboratoryFee}</span>
                  </div>
                  <div className="border-t pt-2 font-medium flex justify-between">
                    <span>Total</span>
                    <span>₹{selectedStudent.feeDetails.totalDue}</span>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowPaymentForm(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedStudent.feeDetails.status !== 'paid' && (
                  <button 
                    onClick={() => {
                      setShowPaymentModal(true);
                      setShowPaymentForm(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Record Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      
      {showPaymentModal && selectedStudent && (
        <PaymentModal
          student={selectedStudent}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

     
      {showAssignDueModal && selectedStudent && (
        <AssignDueModal
          student={selectedStudent}
          onClose={() => setShowAssignDueModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      
      {showAssignStudentFeeModal && (
        <AssignStudentFeeModal
          onClose={() => setShowAssignStudentFeeModal(false)}
          onSuccess={fetchFeeDetails}
        />
      )}
    </div>

    
  );
};

export default FeePage;