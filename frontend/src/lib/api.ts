const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  console.log('API Request Debug:', { endpoint, hasToken: !!token, token: token ? token.substring(0, 20) + '...' : 'none' });
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    console.error('API Error:', { status: response.status, error });
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  register: async (data: { username: string; email: string; password: string }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: { email: string; password: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Workout API
export const workoutAPI = {
  create: async (data: { workoutType: string; duration: number; caloriesBurned: number; date?: string }) => {
    return apiRequest('/workouts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return apiRequest('/workouts');
  },

  getById: async (workoutId: string) => {
    return apiRequest(`/workouts/single/${workoutId}`);
  },

  update: async (workoutId: string, data: any) => {
    return apiRequest(`/workouts/${workoutId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (workoutId: string) => {
    return apiRequest(`/workouts/${workoutId}`, {
      method: 'DELETE',
    });
  },
};

// Goal API
export const goalAPI = {
  create: async (data: { targetCalories?: number; targetSteps?: number; targetMinutes?: number }) => {
    return apiRequest('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return apiRequest('/goals');
  },

  update: async (goalId: string, data: any) => {
    return apiRequest(`/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (goalId: string) => {
    return apiRequest(`/goals/${goalId}`, {
      method: 'DELETE',
    });
  },
};

// Diet Log API
export const dietLogAPI = {
  create: async (data: { date?: string; meals: any[]; totalCalories?: number }) => {
    return apiRequest('/dietlogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return apiRequest('/dietlogs');
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/dietlogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/dietlogs/${id}`, {
      method: 'DELETE',
    });
  },
};

// Progress Log API
export const progressLogAPI = {
  create: async (data: { weight?: number; bodyFat?: number; notes?: string }) => {
    return apiRequest('/progresslogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return apiRequest('/progresslogs');
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/progresslogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/progresslogs/${id}`, {
      method: 'DELETE',
    });
  },
};

// Todo API
export const todoAPI = {
  create: async (data: { text: string }) => {
    return apiRequest('/todos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return apiRequest('/todos');
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};

// User Profile API (using localStorage for now since backend doesn't have profile endpoints)
export const profileAPI = {
  get: (userId: string) => {
    const profiles = JSON.parse(localStorage.getItem('fitness_tracker_user_profiles') || '[]');
    return profiles.find((p: any) => p.id === userId)?.profile;
  },

  save: (userId: string, profile: any) => {
    const profiles = JSON.parse(localStorage.getItem('fitness_tracker_user_profiles') || '[]');
    const index = profiles.findIndex((p: any) => p.id === userId);
    
    if (index >= 0) {
      profiles[index].profile = profile;
    } else {
      profiles.push({ id: userId, email: '', profile });
    }
    
    localStorage.setItem('fitness_tracker_user_profiles', JSON.stringify(profiles));
  },
};

// Health Metrics API (using localStorage for now)
export const healthMetricsAPI = {
  get: (userId: string) => {
    const metrics = JSON.parse(localStorage.getItem('fitness_tracker_health_metrics') || '[]');
    return metrics.filter((m: any) => m.userId === userId);
  },

  save: (metrics: any) => {
    const allMetrics = JSON.parse(localStorage.getItem('fitness_tracker_health_metrics') || '[]');
    const index = allMetrics.findIndex((m: any) => m.id === metrics.id);
    
    if (index >= 0) {
      allMetrics[index] = metrics;
    } else {
      allMetrics.push(metrics);
    }
    
    localStorage.setItem('fitness_tracker_health_metrics', JSON.stringify(allMetrics));
  },
};

// Chat API (using localStorage for now)
export const chatAPI = {
  getMessages: (userId: string) => {
    const messages = JSON.parse(localStorage.getItem('fitness_tracker_chat_messages') || '[]');
    return messages.filter((msg: any) => msg.senderId === userId || msg.receiverId === userId);
  },

  saveMessage: (message: any) => {
    const messages = JSON.parse(localStorage.getItem('fitness_tracker_chat_messages') || '[]');
    messages.push(message);
    localStorage.setItem('fitness_tracker_chat_messages', JSON.stringify(messages));
  },

  getAllUsers: () => {
    return JSON.parse(localStorage.getItem('fitness_tracker_user_profiles') || '[]');
  },
}; 