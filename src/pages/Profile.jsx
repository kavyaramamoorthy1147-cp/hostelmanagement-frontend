import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  BedDouble,
  Building,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

const Profile = () => {
  const { user, refreshUser, isAdmin } = useAuth();

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="My Profile" />

        <div className="page-content">
          <div className="page-header">
            <div className="page-header-info">
              <h1>User Profile & Account</h1>
              <p>Your institutional identification and hostel accommodation records</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={refreshUser}>
              <RefreshCw size={16} />
              <span>Refresh Details</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Personal Details Card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {user?.name}
                  </h2>
                  <span className={`user-role-tag role-${user?.role || 'student'}`}>
                    {user?.role} Account
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  <Mail size={18} color="var(--text-muted)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Email Address
                    </div>
                    <strong style={{ fontSize: '0.92rem' }}>{user?.email}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  <Phone size={18} color="var(--text-muted)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Contact Number
                    </div>
                    <strong style={{ fontSize: '0.92rem' }}>{user?.phone || 'Not provided'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  <BookOpen size={18} color="var(--text-muted)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Department
                    </div>
                    <strong style={{ fontSize: '0.92rem' }}>{user?.department || 'General'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  <GraduationCap size={18} color="var(--text-muted)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Academic Year / Position
                    </div>
                    <strong style={{ fontSize: '0.92rem' }}>{user?.year || '—'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ShieldCheck size={18} color="var(--text-muted)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Gender
                    </div>
                    <strong style={{ fontSize: '0.92rem' }}>{user?.gender || '—'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Allocation Details Card */}
            {!isAdmin ? (
              <div className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BedDouble size={20} color="var(--primary)" />
                    <h3 className="card-title">Assigned Accommodation</h3>
                  </div>
                  {user?.room && (
                    <span className="badge badge-available">Active Allotment</span>
                  )}
                </div>

                {user?.room ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        textAlign: 'center'
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Room Allocation
                      </span>
                      <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                        Room {user.room.roomNumber}
                      </h2>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
                        {user.room.block} • Floor {user.room.floor}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Room Capacity</span>
                      <strong>{user.room.capacity} Beds</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Current Occupants</span>
                      <strong>{user.room.occupiedBeds} Beds Taken</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Room Status</span>
                      <span className={`badge ${user.room.status === 'Available' ? 'badge-available' : 'badge-full'}`}>
                        {user.room.status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <BedDouble className="empty-state-icon" />
                    <h3>No Room Allotment Found</h3>
                    <p>
                      You are currently not assigned to any hostel room. Kindly meet your hostel warden or room allocation officer.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Administrator Privileges</h3>
                </div>
                <div style={{ lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <p style={{ marginBottom: '12px' }}>
                    As an <strong>Administrator</strong>, you have full oversight across the entire Hostel Management System:
                  </p>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li>Add, update, or remove student registration records</li>
                    <li>Configure hostel rooms, floor allocations, and capacities</li>
                    <li>Review resident grievances and update progress status</li>
                    <li>Automatic bed occupancy and room availability synchronization</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
