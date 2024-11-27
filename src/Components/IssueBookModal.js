import React, { useState, useEffect } from 'react';
import { X, Search, BookOpen, RefreshCw } from 'lucide-react';
import ReturnBookModal from './ReturnBookModal';

const IssueBookModal = ({ student, isOpen, onClose }) => {
  const [availableBooks, setAvailableBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableBooks();
    }
  }, [isOpen]);

  const fetchAvailableBooks = async () => {
    try {
      const response = await fetch('http://3.110.25.152:5000/v2/api/list/books', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableBooks(data.books);
      } else {
        console.error('Failed to fetch books');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleBookSelect = (book) => {
    if (selectedBooks.find(b => b.id === book.id)) {
      setSelectedBooks(selectedBooks.filter(b => b.id !== book.id));
    } else {
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  const handleIssueBooks = async () => {
    try {
      const issueData = {
        studentId: student.id,
        bookIds: selectedBooks.map(book => book.id),
        issueDate: new Date().toISOString()
      };

      const response = await fetch('http://3.110.25.152:5000/v2/api/issue/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData)
      });

      if (response.ok) {
        alert('Books issued successfully!');
        onClose();
      } else {
        const error = await response.json();
        alert('Failed to issue books: ' + error.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('Failed to connect to the server.');
    }
  };

  const filteredBooks = availableBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Library Management</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsReturnModalOpen(true)}
                className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Return Books
              </button>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h3 className="text-lg font-medium mb-2">Student Details</h3>
              <div className="grid grid-cols-2 gap-4">
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

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search books..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Select</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Author</th>
                    <th className="p-3 text-left">Available Copies</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map(book => (
                    <tr key={book.id} className="border-b">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedBooks.some(b => b.id === book.id)}
                          onChange={() => handleBookSelect(book)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3">{book.title}</td>
                      <td className="p-3">{book.author}</td>
                      <td className="p-3">{book.availableCopies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              onClick={handleIssueBooks} 
              disabled={selectedBooks.length === 0}
              className={`px-4 py-2 rounded-lg flex items-center ${
                selectedBooks.length === 0 
                  ? 'bg-blue-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Issue {selectedBooks.length} {selectedBooks.length === 1 ? 'Book' : 'Books'}
            </button>
          </div>
        </div>
      </div>

      {isReturnModalOpen && (
        <ReturnBookModal 
          student={student}
          isOpen={isReturnModalOpen}
          onClose={() => setIsReturnModalOpen(false)}
        />
      )}
    </>
  );
};

export default IssueBookModal;