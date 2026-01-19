import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import { studentsAPI } from '../../services/api';
import './StudentProfile.css';

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState({});
  const [employabilityIndex, setEmployabilityIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

  const [profileData, setProfileData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      rollNumber: '',
      department: '',
      year: '',
      cgpa: 0,
      dateOfBirth: '',
      gender: '',
      address: '',
    },
    skills: [],
    certifications: [],
    internships: [],
    projects: [],
  });

  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner', yearsOfExperience: 0, category: 'Programming' });
  const [newCertification, setNewCertification] = useState({ name: '', issuer: '', dateObtained: '', expiryDate: '', credentialId: '' });
  const [newInternship, setNewInternship] = useState({
    company: '', role: '', startDate: '', endDate: '', description: '', skills: '', current: false
  });

  // Get student ID from logged-in user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      setStudentId(user.id);
    } else {
      // If no user logged in, redirect to login
      window.location.href = '/login';
    }
  }, []);

  // Calculate Employability Index
  useEffect(() => {
    if (studentId) {
      fetchProfileData();
    }
  }, [studentId]);

  useEffect(() => {
    calculateEmployabilityIndex();
  }, [profileData]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getById(studentId);
      console.log('Full API response:', response);
      
      // Extract data from response (backend returns {success: true, data: {...}})
      const data = response.data || response;
      console.log('Student data:', data);

      setProfileData({
        personal: {
          fullName: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          rollNumber: data.roll_number || '',
          department: data.department || '',
          year: data.year || '',
          cgpa: data.cgpa || 0,
          dateOfBirth: data.date_of_birth || '',
          gender: data.gender || '',
          address: data.address || '',
        },
        skills: (data.skills || []).map(skill => ({
          id: skill.id,
          name: skill.skill_name,
          level: skill.proficiency_level,
          yearsOfExperience: skill.years_experience,
          category: skill.category
        })),
        certifications: (data.certifications || []).map(cert => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          dateObtained: cert.date_obtained?.substring(0, 7) || '', // Format as YYYY-MM
          expiryDate: cert.expiry_date?.substring(0, 7) || null,
          credentialId: cert.credential_id
        })),
        internships: (data.internships || []).map(intern => ({
          id: intern.id,
          company: intern.company,
          role: intern.role,
          startDate: intern.start_date?.substring(0, 7) || '',
          endDate: intern.end_date?.substring(0, 7) || '',
          description: intern.description,
          skills: typeof intern.skills === 'string' ? JSON.parse(intern.skills || '[]') : (intern.skills || []),
          current: intern.is_current
        })),
        projects: [] // Projects not in current schema
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to load profile data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const calculateEmployabilityIndex = () => {
    const cgpaScore = (profileData.personal.cgpa / 10) * 30; // 30% weightage
    const skillScore = Math.min((profileData.skills.length / 10) * 25, 25); // 25% weightage, max 10 skills
    const certificationScore = Math.min((profileData.certifications.length / 5) * 20, 20); // 20% weightage
    const internshipScore = Math.min((profileData.internships.length / 3) * 15, 15); // 15% weightage
    const projectScore = Math.min((profileData.projects.length / 3) * 10, 10); // 10% weightage

    const totalScore = cgpaScore + skillScore + certificationScore + internshipScore + projectScore;
    setEmployabilityIndex(Math.round(totalScore));
  };

  const getEmployabilityColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getEmployabilityLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  const addSkill = async () => {
    if (!newSkill.name || !newSkill.name.trim()) {
      alert('Please enter a skill name');
      return;
    }
    
    try {
      console.log('Adding skill:', newSkill);
      const response = await studentsAPI.addSkill(studentId, {
        skill_name: newSkill.name,
        proficiency_level: newSkill.level,
        years_experience: parseFloat(newSkill.yearsOfExperience) || 0,
        category: newSkill.category
      });
      console.log('Skill added response:', response);
      
      // Refresh profile data
      await fetchProfileData();
      setNewSkill({ name: '', level: 'Beginner', yearsOfExperience: 0, category: 'Programming' });
      alert('Skill added successfully!');
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Failed to add skill: ' + (error.message || 'Unknown error'));
    }
  };

  const removeSkill = async (id) => {
    try {
      await studentsAPI.deleteSkill(studentId, id);
      await fetchProfileData();
    } catch (error) {
      console.error('Error removing skill:', error);
      alert('Failed to remove skill');
    }
  };

  const addCertification = async () => {
    if (!newCertification.name || !newCertification.name.trim()) {
      alert('Please enter certification name');
      return;
    }
    if (!newCertification.issuer || !newCertification.issuer.trim()) {
      alert('Please enter issuing organization');
      return;
    }
    if (!newCertification.dateObtained) {
      alert('Please select date obtained');
      return;
    }
    
    try {
      console.log('Adding certification:', newCertification);
      const response = await studentsAPI.addCertification(studentId, {
        name: newCertification.name,
        issuer: newCertification.issuer,
        date_obtained: newCertification.dateObtained + '-01', // Add day to make it a valid date
        expiry_date: newCertification.expiryDate ? newCertification.expiryDate + '-01' : null,
        credential_id: newCertification.credentialId || null
      });
      console.log('Certification added response:', response);
      
      await fetchProfileData();
      setNewCertification({ name: '', issuer: '', dateObtained: '', expiryDate: '', credentialId: '' });
      alert('Certification added successfully!');
    } catch (error) {
      console.error('Error adding certification:', error);
      alert('Failed to add certification: ' + (error.message || 'Unknown error'));
    }
  };

  const removeCertification = async (id) => {
    try {
      await studentsAPI.deleteCertification(studentId, id);
      await fetchProfileData();
    } catch (error) {
      console.error('Error removing certification:', error);
      alert('Failed to remove certification');
    }
  };

  const addInternship = async () => {
    if (!newInternship.company || !newInternship.company.trim()) {
      alert('Please enter company name');
      return;
    }
    if (!newInternship.role || !newInternship.role.trim()) {
      alert('Please enter role/position');
      return;
    }
    if (!newInternship.startDate) {
      alert('Please select start date');
      return;
    }
    if (!newInternship.current && !newInternship.endDate) {
      alert('Please select end date or mark as current');
      return;
    }
    
    try {
      console.log('Adding internship:', newInternship);
      const skillsArray = newInternship.skills.split(',').map(s => s.trim()).filter(s => s);
      const response = await studentsAPI.addInternship(studentId, {
        company: newInternship.company,
        role: newInternship.role,
        start_date: newInternship.startDate + '-01', // Add day to make it a valid date
        end_date: newInternship.current ? null : (newInternship.endDate + '-01'),
        description: newInternship.description || '',
        skills: skillsArray,
        is_current: newInternship.current
      });
      console.log('Internship added response:', response);
      
      await fetchProfileData();
      setNewInternship({ company: '', role: '', startDate: '', endDate: '', description: '', skills: '', current: false });
      alert('Internship added successfully!');
    } catch (error) {
      console.error('Error adding internship:', error);
      alert('Failed to add internship: ' + (error.message || 'Unknown error'));
    }
  };

  const removeInternship = async (id) => {
    try {
      await studentsAPI.deleteInternship(studentId, id);
      await fetchProfileData();
    } catch (error) {
      console.error('Error removing internship:', error);
      alert('Failed to remove internship');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="student-profile">
          <PageHeader title="My Profile" subtitle="Loading profile data..." />
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="student-profile">
        <PageHeader
          title="My Profile"
          subtitle="Manage your professional profile and track your employability"
          breadcrumbs={[
            { label: 'Home', link: '/' },
            { label: 'Dashboard', link: '/student/dashboard' },
            { label: 'Profile' }
          ]}
          actions={
            <button className="btn-primary" onClick={() => alert('Profile saved!')}>
              Save Profile
            </button>
          }
        />

        {/* Employability Index Card */}
        <div className="employability-card">
          <div className="employability-header">
            <h3>Employability Index</h3>
            <span className="employability-label" style={{ color: getEmployabilityColor(employabilityIndex) }}>
              {getEmployabilityLabel(employabilityIndex)}
            </span>
          </div>
          <div className="employability-score">
            <div className="score-circle" style={{ 
              background: `conic-gradient(${getEmployabilityColor(employabilityIndex)} ${employabilityIndex * 3.6}deg, #f3f4f6 0deg)` 
            }}>
              <div className="score-inner">
                <span className="score-value">{employabilityIndex}</span>
                <span className="score-max">/100</span>
              </div>
            </div>
            <div className="score-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">CGPA (30%)</span>
                <span className="breakdown-value">{Math.round((profileData.personal.cgpa / 10) * 30)}/30</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Skills (25%)</span>
                <span className="breakdown-value">{Math.min(Math.round((profileData.skills.length / 10) * 25), 25)}/25</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Certifications (20%)</span>
                <span className="breakdown-value">{Math.min(Math.round((profileData.certifications.length / 5) * 20), 20)}/20</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Internships (15%)</span>
                <span className="breakdown-value">{Math.min(Math.round((profileData.internships.length / 3) * 15), 15)}/15</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Projects (10%)</span>
                <span className="breakdown-value">{Math.min(Math.round((profileData.projects.length / 3) * 10), 10)}/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`profile-tab ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            Skills ({profileData.skills.length})
          </button>
          <button 
            className={`profile-tab ${activeTab === 'certifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('certifications')}
          >
            Certifications ({profileData.certifications.length})
          </button>
          <button 
            className={`profile-tab ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            Experience ({profileData.internships.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="info-card">
                <h3>Personal Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <p>{profileData.personal.fullName}</p>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <p>{profileData.personal.email}</p>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <p>{profileData.personal.phone}</p>
                  </div>
                  <div className="info-item">
                    <label>Roll Number</label>
                    <p>{profileData.personal.rollNumber}</p>
                  </div>
                  <div className="info-item">
                    <label>Department</label>
                    <p>{profileData.personal.department}</p>
                  </div>
                  <div className="info-item">
                    <label>Year</label>
                    <p>{profileData.personal.year}</p>
                  </div>
                  <div className="info-item">
                    <label>CGPA</label>
                    <p className="cgpa-highlight">{profileData.personal.cgpa}/10</p>
                  </div>
                  <div className="info-item">
                    <label>Date of Birth</label>
                    <p>{new Date(profileData.personal.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Quick Stats</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-value">{profileData.skills.length}</div>
                    <div className="stat-label">Skills</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-value">{profileData.certifications.length}</div>
                    <div className="stat-label">Certifications</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">💼</div>
                    <div className="stat-value">{profileData.internships.length}</div>
                    <div className="stat-label">Internships</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📁</div>
                    <div className="stat-value">{profileData.projects.length}</div>
                    <div className="stat-label">Projects</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="skills-section">
              <div className="section-card">
                <div className="section-header">
                  <h3>Add New Skill</h3>
                </div>
                <div className="add-form">
                  <input
                    type="text"
                    placeholder="Skill name (e.g., Python)"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  />
                  <select value={newSkill.level} onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Years"
                    value={newSkill.yearsOfExperience}
                    onChange={(e) => setNewSkill({ ...newSkill, yearsOfExperience: parseFloat(e.target.value) })}
                    step="0.5"
                    min="0"
                  />
                  <select value={newSkill.category} onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}>
                    <option value="Programming">Programming</option>
                    <option value="Framework">Framework</option>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Database">Database</option>
                    <option value="Cloud">Cloud</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Other">Other</option>
                  </select>
                  <button onClick={addSkill} className="btn-add">Add Skill</button>
                </div>
              </div>

              <div className="section-card">
                <h3>My Skills</h3>
                <div className="skills-list">
                  {profileData.skills.map((skill) => (
                    <div key={skill.id} className="skill-item">
                      <div className="skill-info">
                        <h4>{skill.name}</h4>
                        <div className="skill-meta">
                          <span className="skill-level">{skill.level}</span>
                          <span className="skill-experience">{skill.yearsOfExperience} years</span>
                          <span className="skill-category">{skill.category}</span>
                        </div>
                      </div>
                      <button onClick={() => removeSkill(skill.id)} className="btn-remove">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="certifications-section">
              <div className="section-card">
                <div className="section-header">
                  <h3>Add New Certification</h3>
                </div>
                <div className="add-form">
                  <input
                    type="text"
                    placeholder="Certification name"
                    value={newCertification.name}
                    onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Issuing organization"
                    value={newCertification.issuer}
                    onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                  />
                  <input
                    type="month"
                    placeholder="Date obtained"
                    value={newCertification.dateObtained}
                    onChange={(e) => setNewCertification({ ...newCertification, dateObtained: e.target.value })}
                  />
                  <input
                    type="month"
                    placeholder="Expiry date (optional)"
                    value={newCertification.expiryDate}
                    onChange={(e) => setNewCertification({ ...newCertification, expiryDate: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Credential ID"
                    value={newCertification.credentialId}
                    onChange={(e) => setNewCertification({ ...newCertification, credentialId: e.target.value })}
                  />
                  <button onClick={addCertification} className="btn-add">Add Certification</button>
                </div>
              </div>

              <div className="section-card">
                <h3>My Certifications</h3>
                <div className="certifications-list">
                  {profileData.certifications.map((cert) => (
                    <div key={cert.id} className="certification-item">
                      <div className="cert-icon">🏆</div>
                      <div className="cert-info">
                        <h4>{cert.name}</h4>
                        <p className="cert-issuer">{cert.issuer}</p>
                        <div className="cert-meta">
                          <span>Obtained: {new Date(cert.dateObtained).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                        </div>
                      </div>
                      <button onClick={() => removeCertification(cert.id)} className="btn-remove">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="experience-section">
              <div className="section-card">
                <div className="section-header">
                  <h3>Add New Internship</h3>
                </div>
                <div className="add-form internship-form">
                  <input
                    type="text"
                    placeholder="Company name"
                    value={newInternship.company}
                    onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={newInternship.role}
                    onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })}
                  />
                  <input
                    type="month"
                    placeholder="Start date"
                    value={newInternship.startDate}
                    onChange={(e) => setNewInternship({ ...newInternship, startDate: e.target.value })}
                  />
                  <input
                    type="month"
                    placeholder="End date"
                    value={newInternship.endDate}
                    onChange={(e) => setNewInternship({ ...newInternship, endDate: e.target.value })}
                    disabled={newInternship.current}
                  />
                  <textarea
                    placeholder="Description"
                    value={newInternship.description}
                    onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                    rows="2"
                  />
                  <input
                    type="text"
                    placeholder="Skills used (comma-separated)"
                    value={newInternship.skills}
                    onChange={(e) => setNewInternship({ ...newInternship, skills: e.target.value })}
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newInternship.current}
                      onChange={(e) => setNewInternship({ ...newInternship, current: e.target.checked })}
                    />
                    Currently working here
                  </label>
                  <button onClick={addInternship} className="btn-add">Add Internship</button>
                </div>
              </div>

              <div className="section-card">
                <h3>My Experience</h3>
                <div className="internships-list">
                  {profileData.internships.map((internship) => (
                    <div key={internship.id} className="internship-item">
                      <div className="internship-header">
                        <div>
                          <h4>{internship.role}</h4>
                          <p className="internship-company">{internship.company}</p>
                          <p className="internship-duration">
                            {new Date(internship.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                            {internship.current ? ' Present' : ' ' + new Date(internship.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <button onClick={() => removeInternship(internship.id)} className="btn-remove">×</button>
                      </div>
                      <p className="internship-description">{internship.description}</p>
                      <div className="internship-skills">
                        {internship.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfile;