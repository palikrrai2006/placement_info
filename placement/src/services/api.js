const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for fetch requests
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Students API
export const studentsAPI = {
  getAll: () => fetchAPI('/students'),
  getById: (id) => fetchAPI(`/students/${id}`),
  create: (studentData) => fetchAPI('/students', {
    method: 'POST',
    body: JSON.stringify(studentData),
  }),
  update: (id, studentData) => fetchAPI(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(studentData),
  }),
  delete: (id) => fetchAPI(`/students/${id}`, {
    method: 'DELETE',
  }),
  addSkill: (id, skillData) => fetchAPI(`/students/${id}/skills`, {
    method: 'POST',
    body: JSON.stringify(skillData),
  }),
  deleteSkill: (id, skillId) => fetchAPI(`/students/${id}/skills/${skillId}`, {
    method: 'DELETE',
  }),
  addCertification: (id, certData) => fetchAPI(`/students/${id}/certifications`, {
    method: 'POST',
    body: JSON.stringify(certData),
  }),
  deleteCertification: (id, certId) => fetchAPI(`/students/${id}/certifications/${certId}`, {
    method: 'DELETE',
  }),
  updateCertification: (id, certId, certData) => fetchAPI(`/students/${id}/certifications/${certId}`, {
    method: 'PUT',
    body: JSON.stringify(certData),
  }),
  addInternship: (id, internshipData) => fetchAPI(`/students/${id}/internships`, {
    method: 'POST',
    body: JSON.stringify(internshipData),
  }),
  deleteInternship: (id, internshipId) => fetchAPI(`/students/${id}/internships/${internshipId}`, {
    method: 'DELETE',
  }),
  updateInternship: (id, internshipId, internshipData) => fetchAPI(`/students/${id}/internships/${internshipId}`, {
    method: 'PUT',
    body: JSON.stringify(internshipData),
  }),
};

// Companies API
export const companiesAPI = {
  getAll: () => fetchAPI('/companies'),
  getById: (id) => fetchAPI(`/companies/${id}`),
  create: (companyData) => fetchAPI('/companies', {
    method: 'POST',
    body: JSON.stringify(companyData),
  }),
  update: (id, companyData) => fetchAPI(`/companies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(companyData),
  }),
  delete: (id) => fetchAPI(`/companies/${id}`, {
    method: 'DELETE',
  }),
};

// Jobs API
export const jobsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetchAPI(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
  },
  getById: (id) => fetchAPI(`/jobs/${id}`),
  create: (jobData) => fetchAPI('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  }),
  update: (id, jobData) => fetchAPI(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jobData),
  }),
  delete: (id) => fetchAPI(`/jobs/${id}`, {
    method: 'DELETE',
  }),
};

// Applications API
export const applicationsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetchAPI(`/applications${params.toString() ? `?${params.toString()}` : ''}`);
  },
  getById: (id) => fetchAPI(`/applications/${id}`),
  create: (applicationData) => fetchAPI('/applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  }),
  update: (id, updateData) => fetchAPI(`/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }),
  delete: (id) => fetchAPI(`/applications/${id}`, {
    method: 'DELETE',
  }),
};

// Analytics API
export const analyticsAPI = {
  getStats: () => fetchAPI('/analytics/stats'),
  getDepartments: () => fetchAPI('/analytics/departments'),
  getSkills: () => fetchAPI('/analytics/skills'),
  getCompanies: () => fetchAPI('/analytics/companies'),
  getApplicationStatus: () => fetchAPI('/analytics/applications/status'),
  getPackageDistribution: () => fetchAPI('/analytics/package-distribution'),
};

// College Dashboard API
export const collegeDashboardAPI = {
  getStats: () => fetchAPI('/college/stats'),
  getRecentStudents: (limit) => fetchAPI(`/college/students/recent${limit ? `?limit=${limit}` : ''}`),
  getActiveCompanies: () => fetchAPI('/college/companies/active'),
  getUpcomingDrives: () => fetchAPI('/college/drives/upcoming'),
  getBranchWiseStats: () => fetchAPI('/college/placements/branch-wise'),
  getRecentApplications: (limit) => fetchAPI(`/college/applications/recent${limit ? `?limit=${limit}` : ''}`),
  getTopStudents: () => fetchAPI('/college/students/top'),
  getCompanyHiringStats: () => fetchAPI('/college/companies/hiring-stats'),
  getPlacementTrends: () => fetchAPI('/college/placements/trends'),
  getApplicationStatusBreakdown: () => fetchAPI('/college/applications/status-breakdown'),
};

// Health check
export const healthCheck = () => fetchAPI('/health');

export default {
  students: studentsAPI,
  companies: companiesAPI,
  jobs: jobsAPI,
  applications: applicationsAPI,
  analytics: analyticsAPI,
  collegeDashboard: collegeDashboardAPI,
  healthCheck,
};
