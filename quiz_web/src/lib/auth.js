export const auth = {
  getToken: () => localStorage.getItem('admin_token'),
  
  setToken: (token) => {
    localStorage.setItem('admin_token', token);
  },
  
  clearToken: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },
  
  getAdmin: () => {
    const adminStr = localStorage.getItem('admin_user');
    return adminStr ? JSON.parse(adminStr) : null;
  },
  
  setAdmin: (admin) => {
    localStorage.setItem('admin_user', JSON.stringify(admin));
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('admin_token');
  },
};

