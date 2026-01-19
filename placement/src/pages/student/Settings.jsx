import React, { useState } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@university.edu',
    phone: '+91 98765 43210',
    rollNumber: 'CS2021-001',
    department: 'CS',
    year: '4',
    cgpa: '8.5',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    applicationUpdates: true,
    interviewReminders: true,
    newJobAlerts: true,
    weeklyDigest: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({ ...prev, [name]: checked }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
    alert('Profile updated successfully!');
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    console.log('Preferences updated:', preferences);
    alert('Preferences saved successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Password changed');
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <Layout>
      <div className="settings-page">
        <PageHeader
          title="Settings"
          subtitle="Manage your account and preferences"
          breadcrumbs={[
            { label: 'Home', link: '/' },
            { label: 'Dashboard', link: '/student/dashboard' },
            { label: 'Settings' }
          ]}
        />

        <div className="settings-container">
          {/* Settings Sidebar */}
          <div className="settings-sidebar">
            <button
              className={`setting-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="tab-icon">👤</span>
              <span>Profile</span>
            </button>
            <button
              className={`setting-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <span className="tab-icon">🔒</span>
              <span>Security</span>
            </button>
            <button
              className={`setting-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <span className="tab-icon">🔔</span>
              <span>Notifications</span>
            </button>
            <button
              className={`setting-tab ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <span className="tab-icon">🛡️</span>
              <span>Privacy</span>
            </button>
          </div>

          {/* Settings Content */}
          <div className="settings-content">
            {activeTab === 'profile' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Profile Information</h2>
                  <p>Update your personal and academic details</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="settings-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="rollNumber">Roll Number</label>
                      <input
                        type="text"
                        id="rollNumber"
                        name="rollNumber"
                        value={profileData.rollNumber}
                        onChange={handleProfileChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="department">Department</label>
                      <select
                        id="department"
                        name="department"
                        value={profileData.department}
                        onChange={handleProfileChange}
                        required
                      >
                        <option value="CS">Computer Science</option>
                        <option value="IT">Information Technology</option>
                        <option value="ECE">Electronics & Communication</option>
                        <option value="ME">Mechanical Engineering</option>
                        <option value="CE">Civil Engineering</option>
                        <option value="EE">Electrical Engineering</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="year">Year</label>
                      <select
                        id="year"
                        name="year"
                        value={profileData.year}
                        onChange={handleProfileChange}
                        required
                      >
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="cgpa">CGPA</label>
                    <input
                      type="number"
                      id="cgpa"
                      name="cgpa"
                      value={profileData.cgpa}
                      onChange={handleProfileChange}
                      step="0.01"
                      min="0"
                      max="10"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Security Settings</h2>
                  <p>Manage your password and security options</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="settings-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      required
                    />
                    <span className="form-hint">Must be at least 6 characters</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Change Password
                    </button>
                  </div>
                </form>

                <div className="security-info">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                  <button className="btn-secondary">Enable 2FA</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Notification Preferences</h2>
                  <p>Choose how you want to be notified</p>
                </div>

                <form onSubmit={handlePreferencesSubmit} className="settings-form">
                  <div className="preference-group">
                    <h3>Communication Channels</h3>
                    <div className="preference-item">
                      <div className="preference-info">
                        <label htmlFor="emailNotifications">Email Notifications</label>
                        <p>Receive notifications via email</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          name="emailNotifications"
                          checked={preferences.emailNotifications}
                          onChange={handlePreferenceChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="preference-item">
                      <div className="preference-info">
                        <label htmlFor="smsNotifications">SMS Notifications</label>
                        <p>Receive notifications via SMS</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          id="smsNotifications"
                          name="smsNotifications"
                          checked={preferences.smsNotifications}
                          onChange={handlePreferenceChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="preference-group">
                    <h3>Notification Types</h3>
                    <div className="preference-item">
                      <div className="preference-info">
                        <label htmlFor="applicationUpdates">Application Updates</label>
                        <p>Get notified about application status changes</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          id="applicationUpdates"
                          name="applicationUpdates"
                          checked={preferences.applicationUpdates}
                          onChange={handlePreferenceChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="preference-item">
                      <div className="preference-info">
                        <label htmlFor="interviewReminders">Interview Reminders</label>
                        <p>Receive reminders for upcoming interviews</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          id="interviewReminders"
                          name="interviewReminders"
                          checked={preferences.interviewReminders}
                          onChange={handlePreferenceChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="preference-item">
                      <div className="preference-info">
                        <label htmlFor="newJobAlerts">New Job Alerts</label>
                        <p>Be notified when new jobs are posted</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          id="newJobAlerts"
                          name="newJobAlerts"
                          checked={preferences.newJobAlerts}
                          onChange={handlePreferenceChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="preference-item">
                      <div className="preference-info">
                        <label htmlFor="weeklyDigest">Weekly Digest</label>
                        <p>Receive a weekly summary of activities</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          id="weeklyDigest"
                          name="weeklyDigest"
                          checked={preferences.weeklyDigest}
                          onChange={handlePreferenceChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Save Preferences
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Privacy Settings</h2>
                  <p>Control your privacy and data preferences</p>
                </div>

                <div className="privacy-options">
                  <div className="privacy-item">
                    <h3>Profile Visibility</h3>
                    <p>Control who can see your profile information</p>
                    <select className="privacy-select">
                      <option value="public">Public - Everyone can see</option>
                      <option value="companies">Companies Only</option>
                      <option value="private">Private - Only me</option>
                    </select>
                  </div>

                  <div className="privacy-item">
                    <h3>Download My Data</h3>
                    <p>Get a copy of all your data</p>
                    <button className="btn-secondary">Request Data Export</button>
                  </div>

                  <div className="privacy-item danger-zone">
                    <h3>Delete Account</h3>
                    <p>Permanently delete your account and all data</p>
                    <button className="btn-danger">Delete Account</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
