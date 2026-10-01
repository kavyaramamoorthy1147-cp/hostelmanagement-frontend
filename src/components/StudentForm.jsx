import React, { useState, useEffect } from 'react';

const StudentForm = ({ initialData, rooms = [], onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Computer Science',
    year: '1st Year',
    gender: 'Male',
    room: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '', // leave blank when editing unless changing
        phone: initialData.phone || '',
        department: initialData.department || 'Computer Science',
        year: initialData.year || '1st Year',
        gender: initialData.gender || 'Male',
        room: initialData.room?._id || initialData.room || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = Boolean(initialData?._id);

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="e.g. Alex Johnson"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="student@college.edu"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Password {isEditing ? '(leave blank to keep current)' : '*'}
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder={isEditing ? '••••••••' : 'Min. 6 characters'}
            value={formData.password}
            onChange={handleChange}
            required={!isEditing}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            placeholder="e.g. 9876543210"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Gender</label>
          <select
            name="gender"
            className="form-control"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Department</label>
          <select
            name="department"
            className="form-control"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Comm.">Electronics & Comm.</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Business Administration">Business Administration</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Year of Study</label>
          <select
            name="year"
            className="form-control"
            value={formData.year}
            onChange={handleChange}
          >
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Assign Room</label>
        <select
          name="room"
          className="form-control"
          value={formData.room}
          onChange={handleChange}
        >
          <option value="">-- No Room Assigned --</option>
          {rooms.map((r) => {
            const isCurrentRoom = isEditing && initialData?.room?._id === r._id;
            const isFull = r.occupiedBeds >= r.capacity && !isCurrentRoom;
            return (
              <option
                key={r._id}
                value={r._id}
                disabled={isFull}
              >
                Room {r.roomNumber} ({r.block}, Flr {r.floor}) - {r.occupiedBeds}/{r.capacity} beds {isFull ? '(FULL)' : ''}
              </option>
            );
          })}
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Student' : 'Add Student'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
