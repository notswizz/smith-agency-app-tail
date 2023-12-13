export const loadData = (key) => {
  // Ensure we're running in a client-side environment
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading data:', error);
      return [];
    }
  } else {
    // Return a default value if we're on the server
    return [];
  }
};

export const saveData = (key, data) => {
  // Ensure we're running in a client-side environment
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }
};
