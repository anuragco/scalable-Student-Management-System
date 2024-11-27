import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';

const ReturnBookModal = ({ student, isOpen, onClose }) => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    if (isOpen && student) {
      fetchIssuedBooks();
    }
  }, [isOpen, student]);

  const fetchIssuedBooks = async () => {
    try {
      const response = await fetch(`http://3.110.25.152:5000/v2/api/student/${student.id}/issued-books`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.success) {
        setIssuedBooks(data.issuedBooks);
      } else {
        console.error('Failed to fetch issued books');
        alert('No books found for this student');
      }
    } catch (error) {
      console.error('Error fetching issued books:', error);
      alert('Error fetching issued books');
    }
  };

  const handleBookSelect = (book) => {
    if (selectedBooks.find(b => b.issueId === book.issueId)) {
      setSelectedBooks(selectedBooks.filter(b => b.issueId !== book.issueId));
    } else {
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  const handleReturnBooks = async () => {
    try {
      const returnData = {
        issueIds: selectedBooks.map(book => book.issueId),
        returnUrl: '/students'
      };

      const response = await fetch('http://3.110.25.152:5000/v2/api/return/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnData)
      });

      const result = await response.json();
      if (result.success) {
        alert('Books returned successfully!');
        onClose();
        fetchIssuedBooks();
      } else {
        alert('Failed to return books: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('Failed to connect to the server.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Return Books</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h3 className="text-lg font-medium mb-2">Student Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{student?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registration Number</p>
                <p className="font-medium">{student?.regNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium">{student?.class}</p>
              </div>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {issuedBooks.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No books currently issued to this student
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Select</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Author</th>
                    <th className="p-3 text-left">ISBN</th>
                    <th className="p-3 text-left">Issue Date</th>
                    <th className="p-3 text-left">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {issuedBooks.map(book => (
                    <tr key={book.issueId} className="border-b">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedBooks.some(b => b.issueId === book.issueId)}
                          onChange={() => handleBookSelect(book)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3">{book.title}</td>
                      <td className="p-3">{book.author}</td>
                      <td className="p-3">{book.isbn}</td>
                      <td className="p-3">{new Date(book.issueDate).toLocaleDateString()}</td>
                      <td className="p-3">{new Date(book.dueDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleReturnBooks} 
            disabled={selectedBooks.length === 0}
            className={`px-4 py-2 rounded-lg flex items-center ${
              selectedBooks.length === 0 
                ? 'bg-green-300 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Return {selectedBooks.length} {selectedBooks.length === 1 ? 'Book' : 'Books'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnBookModal;