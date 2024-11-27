import React, { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import axios from 'axios';

const AssignDueModal = ({ student, onClose, onSuccess }) => {
  const [dueDetails, setDueDetails] = useState({
    tuitionFee: 0,
    libraryFee: 0,
    laboratoryFee: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const totalNewDue = Object.values(dueDetails).reduce(
    (sum, value) => sum + (parseFloat(value) || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (totalNewDue <= 0) {
        throw new Error('Total due amount must be greater than 0');
      }

      const response = await axios.post(
        `http://3.110.25.152:5000/v2/api/payment/assign-due/${student.id}`,
        {
          tuition_fee: parseFloat(dueDetails.tuitionFee) || 0,
          library_fee: parseFloat(dueDetails.libraryFee) || 0,
          laboratory_fee: parseFloat(dueDetails.laboratoryFee) || 0,
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setDueDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {success ? (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-medium mb-2">Due Amount Assigned Successfully</h2>
            <p className="text-gray-500">The new due amount has been assigned to the student.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Assign Due Amount</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Student Name</p>
                <p className="font-medium">{student.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Current Total Due</p>
                <p className="font-medium">₹{student.feeDetails.totalDue}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tuition Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={dueDetails.tuitionFee}
                      onChange={(e) => handleInputChange('tuitionFee', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Library Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={dueDetails.libraryFee}
                      onChange={(e) => handleInputChange('libraryFee', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Laboratory Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={dueDetails.laboratoryFee}
                      onChange={(e) => handleInputChange('laboratoryFee', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total New Due:</span>
                  <span className="font-medium">₹{totalNewDue}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={loading}
                >
                  {loading ? 'Assigning...' : 'Assign Due'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignDueModal;