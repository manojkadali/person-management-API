
const API_URL = '/api/person';

const ApiService = {
  /**
   * Get all people
   * @returns {Promise<Array>} 
   */
  getAllPeople: async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.data.people;
      } else {
        throw new Error(data.message || 'Failed to fetch people');
      }
    } catch (error) {
      console.error('Error fetching people:', error);
      throw error;
    }
  },
  
  /**
   * Get a single person by ID
   * @param {string} id - Person ID
   * @returns {Promise<Object>} Person object
   */
  getPerson: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.data.person;
      } else {
        throw new Error(data.message || 'Person not found');
      }
    } catch (error) {
      console.error(`Error fetching person with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new person
   * @param {Object} personData - Person data
   * @returns {Promise<Object>} Created person object
   */
  createPerson: async (personData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personData),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.data.person;
      } else if (data.errors) {
        throw new Error(data.errors.map(e => e.msg).join(', '));
      } else {
        throw new Error(data.message || 'Failed to create person');
      }
    } catch (error) {
      console.error('Error creating person:', error);
      throw error;
    }
  },
  
  /**
   * Update a person
   * @param {string} id - Person ID
   * @param {Object} personData - Updated person data
   * @returns {Promise<Object>} Updated person object
   */
  updatePerson: async (id, personData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personData),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.data.person;
      } else if (data.errors) {
        throw new Error(data.errors.map(e => e.msg).join(', '));
      } else {
        throw new Error(data.message || 'Failed to update person');
      }
    } catch (error) {
      console.error(`Error updating person with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a person
   * @param {string} id - Person ID
   * @returns {Promise<boolean>} True if successful
   */
  deletePerson: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      // No content response (204)
      if (response.status === 204) {
        return true;
      }
      
      // Error handling for other responses
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete person');
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting person with ID ${id}:`, error);
      throw error;
    }
  }
};