import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import ComplaintForm from '../components/ComplaintForm';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import {
  AlertCircle,
  PlusCircle,
  CheckCircle,
  Trash2,
  Edit2,
  Clock,
  Filter
} from 'lucide-react';

const Complaints = () => {
  const { user, isAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingComplaint(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (complaint) => {
    setEditingComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');

      if (editingComplaint) {
        await api.put(`/complaints/${editingComplaint._id}`, formData);
        showNotification('Complaint updated successfully');
      } else {
        await api.post('/complaints', formData);
        showNotification('Complaint submitted successfully');
      }

      setIsModalOpen(false);
      fetchComplaints();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await api.put(`/complaints/${complaintId}`, { status: newStatus });
      showNotification(`Status updated to "${newStatus}"`);
      fetchComplaints();
    } catch (err) {
      console.error(err);
      setError('Failed to update complaint status');
    }
  };

  const handleDeleteComplaint = async (complaintId, title) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete complaint "${title}"?`);
    if (!confirmDelete) return;

    try {
      await api.delete(`/complaints/${complaintId}`);
      showNotification('Complaint deleted successfully');
      fetchComplaints();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete complaint');
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter === 'All') return true;
    return c.status === statusFilter;
  });

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title={isAdmin ? 'Complaint Management' : 'My Complaints'} />

        <div className="page-content">
          <div className="page-header">
            <div className="page-header-info">
              <h1>{isAdmin ? 'Student Complaints & Maintenance' : 'Hostel Issues & Grievances'}</h1>
              <p>
                {isAdmin
                  ? 'Review, process, and update the status of student maintenance requests'
                  : 'Track submitted issues, maintenance progress, and file new requests'}
              </p>
            </div>
            {!isAdmin && (
              <button className="btn btn-primary" onClick={handleOpenAddModal}>
                <PlusCircle size={18} />
                <span>Submit Complaint</span>
              </button>
            )}
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

          {/* Filter Tabs */}
          <div className="card" style={{ padding: '12px 20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} color="var(--text-muted)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Filter by Status:
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['All', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
                  <button
                    key={tab}
                    className={`btn btn-sm ${statusFilter === tab ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setStatusFilter(tab)}
                  >
                    {tab}
                    {tab !== 'All' && (
                      <span style={{ marginLeft: '4px', opacity: 0.8 }}>
                        ({complaints.filter((c) => c.status === tab).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="card">
            {loading ? (
              <p style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading complaints...
              </p>
            ) : filteredComplaints.length === 0 ? (
              <div className="empty-state">
                <CheckCircle className="empty-state-icon" style={{ color: '#10b981' }} />
                <h3>No Complaints in this category</h3>
                <p>
                  {statusFilter === 'All'
                    ? 'No complaints have been recorded yet.'
                    : `There are currently no complaints marked as "${statusFilter}".`}
                </p>
                {!isAdmin && statusFilter === 'All' && (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '14px' }}
                    onClick={handleOpenAddModal}
                  >
                    Submit First Complaint
                  </button>
                )}
              </div>
            ) : (
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      {isAdmin && <th>Student Details</th>}
                      {isAdmin && <th>Room</th>}
                      <th>Complaint Title</th>
                      <th>Description</th>
                      <th>Submitted Date</th>
                      <th>Current Status</th>
                      {isAdmin ? <th>Update Status</th> : null}
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((c) => (
                      <tr key={c._id}>
                        {isAdmin && (
                          <td>
                            <strong>{c.student?.name || 'Unknown Student'}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {c.student?.email}
                            </div>
                          </td>
                        )}

                        {isAdmin && (
                          <td>
                            {c.student?.room ? (
                              <span className="badge badge-progress">
                                Room {c.student.room.roomNumber} ({c.student.room.block})
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                Unassigned
                              </span>
                            )}
                          </td>
                        )}

                        <td>
                          <strong>{c.title}</strong>
                        </td>

                        <td style={{ maxWidth: '300px', fontSize: '0.88rem' }}>
                          {c.description}
                        </td>

                        <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              c.status === 'Resolved'
                                ? 'badge-resolved'
                                : c.status === 'In Progress'
                                ? 'badge-progress'
                                : 'badge-pending'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>

                        {isAdmin && (
                          <td>
                            <select
                              className="form-control"
                              style={{ padding: '5px 8px', fontSize: '0.8rem', width: 'auto' }}
                              value={c.status}
                              onChange={(e) => handleStatusChange(c._id, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </td>
                        )}

                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          {(!isAdmin && c.status === 'Pending') && (
                            <button
                              className="btn-icon-edit"
                              title="Edit Complaint"
                              style={{ marginRight: '8px' }}
                              onClick={() => handleOpenEditModal(c)}
                            >
                              <Edit2 size={16} />
                            </button>
                          )}

                          <button
                            className="btn-icon-danger"
                            title="Delete Complaint"
                            onClick={() => handleDeleteComplaint(c._id, c.title)}
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

      {/* Submit / Edit Complaint Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingComplaint ? 'Edit Complaint' : 'Submit New Complaint'}
      >
        <ComplaintForm
          initialData={editingComplaint}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Complaints;
