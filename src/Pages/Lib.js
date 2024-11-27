import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  BookPlus,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  History,
  RefreshCw,
  X
} from 'lucide-react';
import Sidebar from '../Components/Sidebar';

const LibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [newBook, setNewBook] = useState({
    isbn: "",
    title: "",
    author: "",
    category: "",
    quantity: "",
    available: "",
    publisher: "",
    publishYear: "",
    location: ""
  });

  // Fetch books data from API
  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get('http://15.207.102.222:5000/api/books');
      setBooks(response.data);
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book =>
    Object.values(book).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddBook = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://15.207.102.222:5000/api/books', newBook);
    setBooks([...books, response.data]);
    setShowAddModal(false);
    setNewBook({
      isbn: "",
      title: "",
      author: "",
      category: "",
      quantity: "",
      available: "",
      publisher: "",
      publishYear: "",
      location: ""
    });
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    const response = await axios.put(`http://15.207.102.222:5000/api/books/${selectedBook.id}`, selectedBook);
    setBooks(books.map(book => (book.id === selectedBook.id ? response.data : book)));
    setShowEditModal(false);
    setSelectedBook(null);
  };

  const handleDeleteBook = async (id) => {
    await axios.delete(`http://15.207.102.222:5000/api/books/${id}`);
    setBooks(books.filter(book => book.id !== id));
    setShowActionMenu(null);
  };

  const Modal = ({ children, title, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  const BookForm = ({ book, setBook, onSubmit, isEdit }) => (
    <form onSubmit={onSubmit} className="p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">ISBN</label>
          <input
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={book.isbn}
            onChange={(e) => setBook({...book, isbn: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={book.title}
            onChange={(e) => setBook({...book, title: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <input
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={book.author}
            onChange={(e) => setBook({...book, author: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={book.category}
            onChange={(e) => setBook({...book, category: e.target.value})}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          onClick={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isEdit ? 'Save Changes' : 'Add Book'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Sidebar />
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Library Management</h1>
              <p className="text-sm text-gray-500 mt-1">{books.length} books in collection</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <BookPlus className="h-4 w-4 mr-2" />
              Add New Book
            </button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export Catalog
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-y">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Author</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Available</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{book.title}</div>
                      <div className="text-sm text-gray-500">{book.isbn}</div>
                    </td>
                    <td className="py-3 px-4">{book.author}</td>
                    <td className="py-3 px-4">{book.category}</td>
                    <td className="py-3 px-4">{book.available}</td>
                    <td className="py-3 px-4">{book.location}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(book.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {showActionMenu === book.id && (
                          <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg">
                            <button
                              onClick={() => {
                                setSelectedBook(book);
                                setShowEditModal(true);
                                setShowActionMenu(null);
                              }}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 inline mr-2" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Trash2 className="h-4 w-4 inline mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <Modal title="Add New Book" onClose={() => setShowAddModal(false)}>
          <BookForm book={newBook} setBook={setNewBook} onSubmit={handleAddBook} isEdit={false} />
        </Modal>
      )}

      {showEditModal && selectedBook && (
        <Modal title="Edit Book" onClose={() => setShowEditModal(false)}>
          <BookForm book={selectedBook} setBook={setSelectedBook} onSubmit={handleEditBook} isEdit={true} />
        </Modal>
      )}
    </div>
  );
};

export default LibraryPage;
