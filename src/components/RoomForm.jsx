import React, { useState, useEffect } from 'react';

const RoomForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    block: 'A Block',
    floor: 1,
    capacity: 2
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        roomNumber: initialData.roomNumber || '',
        block: initialData.block || 'A Block',
        floor: initialData.floor !== undefined ? initialData.floor : 1,
        capacity: initialData.capacity || 2
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'floor' || name === 'capacity' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = Boolean(initialData?._id);

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Room Number *</label>
        <input
          type="text"
          name="roomNumber"
          className="form-control"
          placeholder="e.g. 101, 204B"
          value={formData.roomNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Block / Wing *</label>
          <select
            name="block"
            className="form-control"
            value={formData.block}
            onChange={handleChange}
            required
          >
            <option value="A Block">A Block</option>
            <option value="B Block">B Block</option>
            <option value="C Block">C Block</option>
            <option value="D Block">D Block</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Floor Number *</label>
          <input
            type="number"
            name="floor"
            min="0"
            max="20"
            className="form-control"
            value={formData.floor}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Bed Capacity *</label>
        <input
          type="number"
          name="capacity"
          min="1"
          max="8"
          className="form-control"
          value={formData.capacity}
          onChange={handleChange}
          required
        />
        <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
          Total student capacity for this room.
        </small>
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
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Room' : 'Create Room'}
        </button>
      </div>
    </form>
  );
};

export default RoomForm;
