import React, { useState } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import './Notifications.css';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'application',
      title: 'Application Status Updated',
      message: 'Your application for Software Engineer at Tech Corp has been shortlisted',
      timestamp: '2025-11-24T10:30:00',
      read: false,
      icon: '📝',
      color: '#22c55e',
    },
    {
      id: 2,
      type: 'interview',
      title: 'Interview Scheduled',
      message: 'Interview with Innovation Labs scheduled for Nov 28, 2025 at 10:00 AM',
      timestamp: '2025-11-24T09:15:00',
      read: false,
      icon: '📅',
      color: '#3b82f6',
    },
    {
      id: 3,
      type: 'deadline',
      title: 'Application Deadline Approaching',
      message: 'Registration for Cloud Systems Inc closes in 2 days',
      timestamp: '2025-11-23T14:20:00',
      read: true,
      icon: '⏰',
      color: '#f59e0b',
    },
    {
      id: 4,
      type: 'announcement',
      title: 'New Company Registered',
      message: 'AI Solutions is now visiting campus. Check out their job openings',
      timestamp: '2025-11-23T11:00:00',
      read: true,
      icon: '📢',
      color: '#8b5cf6',
    },
    {
      id: 5,
      type: 'reminder',
      title: 'Profile Incomplete',
      message: 'Complete your profile to apply for more opportunities',
      timestamp: '2025-11-22T16:45:00',
      read: true,
      icon: '⚠️',
      color: '#ef4444',
    },
  ]);

  const filterOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'application', label: 'Applications' },
    { value: 'interview', label: 'Interviews' },
    { value: 'deadline', label: 'Deadlines' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'reminder', label: 'Reminders' },
  ];

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Layout>
      <div className="notifications-page">
        <PageHeader
          title="Notifications"
          subtitle={`You have ${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}`}
          breadcrumbs={[
            { label: 'Home', link: '/' },
            { label: 'Dashboard', link: '/student/dashboard' },
            { label: 'Notifications' }
          ]}
          actions={
            unreadCount > 0 && (
              <button className="btn-secondary" onClick={markAllAsRead}>
                Mark All as Read
              </button>
            )
          }
        />

        <div className="notifications-container">
          {/* Filters */}
          <div className="notifications-sidebar">
            <div className="filter-section">
              <h3>Filter By</h3>
              <div className="filter-list">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    className={`filter-btn ${filter === option.value ? 'active' : ''}`}
                    onClick={() => setFilter(option.value)}
                  >
                    {option.label}
                    {option.value === 'all' && unreadCount > 0 && (
                      <span className="filter-badge">{unreadCount}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="notifications-main">
            {filteredNotifications.length > 0 ? (
              <div className="notifications-list">
                {filteredNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  >
                    <div 
                      className="notification-icon" 
                      style={{ backgroundColor: `${notification.color}20`, color: notification.color }}
                    >
                      {notification.icon}
                    </div>
                    
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4>{notification.title}</h4>
                        <span className="notification-time">{getTimeAgo(notification.timestamp)}</span>
                      </div>
                      <p>{notification.message}</p>
                    </div>

                    <div className="notification-actions">
                      {!notification.read && (
                        <button 
                          className="action-btn" 
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button 
                        className="action-btn delete" 
                        onClick={() => deleteNotification(notification.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔔</div>
                <h3>No notifications</h3>
                <p>You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
