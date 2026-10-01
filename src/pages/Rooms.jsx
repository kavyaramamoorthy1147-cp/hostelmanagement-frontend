import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import RoomForm from '../components/RoomForm';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import {
  BedDouble,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Building
} from 'lucide-react';

const Rooms = () => {
  const { isAdmin } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');

      if (editingRoom) {
        await api.put(`/rooms/${editingRoom._id}`, formData);
        showNotification('Room details updated successfully');
      } else {
        await api.post('/rooms', formData);
        showNotification('New room created successfully');
      }

      setIsModalOpen(false);
      fetchRooms();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoom = async (roomId, roomNumber) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete Room ${roomNumber}? Any assigned students will be unassigned.`
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/rooms/${roomId}`);
      showNotification(`Room ${roomNumber} deleted successfully`);
      fetchRooms();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete room');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Hostel Rooms" />

        <div className="page-content">
          <div className="page-header">
            <div className="page-header-info">
              <h1>Hostel Accommodation & Rooms</h1>
              <p>
                {isAdmin
                  ? 'Manage hostel room inventory, capacities, and availability'
                  : 'View available rooms and hostel block facilities'}
              </p>
            </div>
            {isAdmin && (
              <button className="btn btn-primary" onClick={handleOpenAddModal}>
                <PlusCircle size={18} />
                <span>Add New Room</span>
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

          <div className="card">
            {loading ? (
              <p style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading rooms inventory...
              </p>
            ) : rooms.length === 0 ? (
              <div className="empty-state">
                <BedDouble className="empty-state-icon" />
                <h3>No Rooms Added</h3>
                <p>There are no hostel rooms registered in the database.</p>
                {isAdmin && (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '12px' }}
                    onClick={handleOpenAddModal}
                  >
                    Create First Room
                  </button>
                )}
              </div>
            ) : (
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Room Number</th>
                      <th>Hostel Block</th>
                      <th>Floor Level</th>
                      <th>Capacity</th>
                      <th>Occupied Beds</th>
                      <th>Status</th>
                      {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room._id}>
                        <td>
                          <strong>Room {room.roomNumber}</strong>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Building size={16} color="var(--primary)" />
                            <span>{room.block}</span>
                          </div>
                        </td>
                        <td>Floor {room.floor}</td>
                        <td>{room.capacity} beds</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>
                              {room.occupiedBeds} / {room.capacity}
                            </span>
                            <div
                              style={{
                                width: '60px',
                                height: '6px',
                                backgroundColor: '#e2e8f0',
                                borderRadius: '3px',
                                overflow: 'hidden'
                              }}
                            >
                              <div
                                style={{
                                  width: `${Math.min(100, (room.occupiedBeds / room.capacity) * 100)}%`,
                                  height: '100%',
                                  backgroundColor:
                                    room.occupiedBeds >= room.capacity ? '#ef4444' : '#10b981'
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              room.status === 'Available' ? 'badge-available' : 'badge-full'
                            }`}
                          >
                            {room.status}
                          </span>
                        </td>
                        {isAdmin && (
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              className="btn-icon-edit"
                              title="Edit Room"
                              style={{ marginRight: '8px' }}
                              onClick={() => handleOpenEditModal(room)}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="btn-icon-danger"
                              title="Delete Room"
                              onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Room Modal */}
      {isAdmin && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Create New Room'}
        >
          <RoomForm
            initialData={editingRoom}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}
    </div>
  );
};

export default Rooms;
