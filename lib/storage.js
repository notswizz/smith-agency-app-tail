// storage.js
export const loadData = (key) => {
  try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
  } catch (error) {
      console.error('Error loading data:', error);
      return [];
  }
};

export const saveData = (key, data) => {
  try {
      localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
      console.error('Error saving data:', error);
  }
};
