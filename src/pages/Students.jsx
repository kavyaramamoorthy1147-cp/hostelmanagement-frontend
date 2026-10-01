import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import StudentForm from '../components/StudentForm';
import api from '../api/axiosInstance';
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');

  // Fetch students & rooms
  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, roomsRes] = await Promise.all([
        api.get(`/students${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`),
        api.get('/rooms')
      ]);
      setStudents(studentsRes.data);
      setRooms(roomsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');

      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, formData);
        showNotification('Student updated successfully');
      } else {
        await api.post('/students', formData);
        showNotification('New student registered and added successfully');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${studentName}"? This will also remove their room allocation and complaints.`
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/students/${studentId}`);
      showNotification(`Student "${studentName}" deleted successfully`);
      fetchData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete student');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Student Management" />

        <div className="page-content">
          <div className="page-header">
            <div className="page-header-info">
              <h1>Hostel Students Directory</h1>
              <p>Manage enrolled students, details, and room assignments</p>
            </div>
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <UserPlus size={18} />
              <span>Add New Student</span>
            </button>
          </div>

          {notification && (
            <div className="alert alert-success">
              <CheckCircle size={18} />
              <span>{notification}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Search & Filter Toolbar */}
          <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
            <div className="table-toolbar" style={{ margin: 0 }}>
              <div className="search-input-wrapper">
                <Search size={18} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by name, email, department, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing <strong>{students.length}</strong> student{students.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="card">
            {loading ? (
              <p style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading students database...
              </p>
            ) : students.length === 0 ? (
              <div className="empty-state">
                <Users className="empty-state-icon" />
                <h3>No Students Found</h3>
                <p>
                  {searchQuery
                    ? `No students match your query "${searchQuery}". Try a different keyword.`
                    : 'There are no students registered yet. Click "Add New Student" to get started.'}
                </p>
                {searchQuery && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '12px' }}
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email & Phone</th>
                      <th>Department & Year</th>
                      <th>Gender</th>
                      <th>Assigned Room</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td>
                          <strong>{student.name}</strong>
                        </td>
                        <td>
                          <div>{student.email}</div>
                          <small style={{ color: 'var(--text-muted)' }}>
                            {student.phone || 'No phone'}
                          </small>
                        </td>
                        <td>
                          <div>{student.department || 'General'}</div>
                          <small style={{ color: 'var(--text-muted)' }}>
                            {student.year || '1st Year'}
                          </small>
                        </td>
                        <td>{student.gender || '—'}</td>
                        <td>
                          {student.room ? (
                            <span className="badge badge-progress">
                              Room {student.room.roomNumber} ({student.room.block})
                            </span>
                          ) : (
                            <span className="badge badge-pending">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            className="btn-icon-edit"
                            title="Edit Student"
                            style={{ marginRight: '8px' }}
                            onClick={() => handleOpenEditModal(student)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon-danger"
                            title="Delete Student"
                            onClick={() => handleDeleteStudent(student._id, student.name)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? `Edit Student: ${editingStudent.name}` : 'Add New Student'}
      >
        <StudentForm
          initialData={editingStudent}
          rooms={rooms}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Students;
