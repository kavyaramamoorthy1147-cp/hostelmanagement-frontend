import React, { useState, useEffect } from 'react';

const ComplaintForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || ''
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
        <label className="form-label">Complaint Title / Issue *</label>
        <input
          type="text"
          name="title"
          className="form-control"
          placeholder="e.g. Broken study light, Leaking bathroom tap, Wi-Fi down"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Detailed Description *</label>
        <textarea
          name="description"
          rows="4"
          className="form-control"
          placeholder="Please describe the issue in detail, including location within the room or block..."
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
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
          {isSubmitting ? 'Submitting...' : isEditing ? 'Update Complaint' : 'Submit Complaint'}
        </button>
      </div>
    </form>
  );
};

export default ComplaintForm;
