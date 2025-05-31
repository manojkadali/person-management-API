
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const personForm = document.getElementById('personForm');
  const formTitle = document.getElementById('formTitle');
  const personId = document.getElementById('personId');
  const submitBtn = document.getElementById('submitBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const addNewBtn = document.getElementById('addNewBtn');
  const peopleTableBody = document.getElementById('peopleTableBody');
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  const searchInput = document.getElementById('searchInput');
  
  // Modal Elements
  const confirmationModal = document.getElementById('confirmationModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  
  // Current person ID to delete
  let personToDelete = null;
  
  // Form Fields
  const nameField = document.getElementById('name');
  const ageField = document.getElementById('age');
  const genderField = document.getElementById('gender');
  const mobileField = document.getElementById('mobile');
  
  // Error message elements
  const nameError = document.getElementById('nameError');
  const ageError = document.getElementById('ageError');
  const genderError = document.getElementById('genderError');
  const mobileError = document.getElementById('mobileError');
  
  // Error mapping
  const errorFieldMap = {
    name: nameError,
    age: ageError,
    gender: genderError,
    mobile: mobileError
  };
  
  /**
   * Load all people from the API and populate the table
   */
  const loadPeople = async () => {
    try {
      loadingState.classList.remove('hidden');
      emptyState.classList.add('hidden');
      
      const people = await ApiService.getAllPeople();
      
      // Clear the table
      peopleTableBody.innerHTML = '';
      
      if (people.length === 0) {
        emptyState.classList.remove('hidden');
      } else {
        // Populate the table
        people.forEach(person => {
          addPersonToTable(person);
        });
      }
    } catch (error) {
      showToast('Error loading people: ' + error.message, 'error');
    } finally {
      loadingState.classList.add('hidden');
    }
  };
  
  /**
   * Add a person to the table
   * @param {Object} person - Person object
   */
  const addPersonToTable = (person) => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', person._id);
    
    row.innerHTML = `
      <td>${person.name}</td>
      <td>${person.age}</td>
      <td>${person.gender}</td>
      <td>${person.mobile}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit-btn" data-id="${person._id}">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="action-btn delete-btn" data-id="${person._id}">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </td>
    `;
    
    // Add event listeners to the buttons
    const editBtn = row.querySelector('.edit-btn');
    const deleteBtn = row.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', () => editPerson(person._id));
    deleteBtn.addEventListener('click', () => openDeleteModal(person._id));
    
    peopleTableBody.appendChild(row);
  };
  
  
  const resetForm = () => {
    personForm.reset();
    personId.value = '';
    formTitle.textContent = 'Add New Person';
    submitBtn.textContent = 'Add Person';
    
    // Clear error messages
    clearErrorMessages();
  };
  
  
  const clearErrorMessages = () => {
    for (const field in errorFieldMap) {
      errorFieldMap[field].style.display = 'none';
      errorFieldMap[field].textContent = '';
    }
  };
  
  /**
   * Set error messages in the form
   * @param {Object} errors - Error object with field names as keys
   */
  const setErrorMessages = (errors) => {
    clearErrorMessages();
    
    for (const field in errors) {
      if (errorFieldMap[field]) {
        errorFieldMap[field].textContent = errors[field];
        errorFieldMap[field].style.display = 'block';
      }
    }
  };
  
  /**
   * Validate the form fields
   * @returns {Object|null} Error object or null if valid
   */
  const validateForm = () => {
    const errors = {};
    
    // Validate name
    if (!nameField.value.trim()) {
      errors.name = 'Name is required';
    }
    
    // Validate age
    if (!ageField.value) {
      errors.age = 'Age is required';
    } else if (parseInt(ageField.value) < 0) {
      errors.age = 'Age cannot be negative';
    }
    
    // Validate gender
    if (!genderField.value) {
      errors.gender = 'Please select a gender';
    }
    
    // Validate mobile
    if (!mobileField.value.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\d{10,15}$/.test(mobileField.value.trim())) {
      errors.mobile = 'Please enter a valid mobile number';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  };
  
  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form
    const errors = validateForm();
    if (errors) {
      setErrorMessages(errors);
      return;
    }
    
    // Get form data
    const formData = {
      name: nameField.value.trim(),
      age: parseInt(ageField.value),
      gender: genderField.value,
      mobile: mobileField.value.trim()
    };
    
    try {
      if (personId.value) {
        // Update existing person
        await ApiService.updatePerson(personId.value, formData);
        showToast('Person updated successfully!', 'success');
      } else {
        // Create new person
        await ApiService.createPerson(formData);
        showToast('Person added successfully!', 'success');
      }
      
      // Reset the form and reload the table
      resetForm();
      loadPeople();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };
  
  /**
   * Edit a person
   * @param {string} id - Person ID
   */
  const editPerson = async (id) => {
    try {
      const person = await ApiService.getPerson(id);
      
      // Set form values
      personId.value = person._id;
      nameField.value = person.name;
      ageField.value = person.age;
      genderField.value = person.gender;
      mobileField.value = person.mobile;
      
      // Update form UI
      formTitle.textContent = 'Edit Person';
      submitBtn.textContent = 'Update Person';
      
      // Scroll to form
      document.querySelector('.person-form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      showToast(error.message, 'error');
    }
  };
  
  /**
   * Open the delete confirmation modal
   * @param {string} id - Person ID
   */
  const openDeleteModal = (id) => {
    personToDelete = id;
    confirmationModal.classList.add('active');
  };
  
  /**
   * Close the delete confirmation modal
   */
  const closeDeleteModal = () => {
    confirmationModal.classList.remove('active');
    personToDelete = null;
  };
  
  /**
   * Delete a person
   */
  const deletePerson = async () => {
    if (!personToDelete) return;
    
    try {
      await ApiService.deletePerson(personToDelete);
      showToast('Person deleted successfully!', 'success');
      
      // Remove the person from the table
      const row = document.querySelector(`tr[data-id="${personToDelete}"]`);
      if (row) {
        row.remove();
      }
      
      // Show empty state if no more people
      if (peopleTableBody.children.length === 0) {
        emptyState.classList.remove('hidden');
      }
      
      // Reset form if the deleted person was being edited
      if (personId.value === personToDelete) {
        resetForm();
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      closeDeleteModal();
    }
  };
  
  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Toast type ('success' or 'error')
   */
  const showToast = (message, type = 'success') => {
    const toastContainer = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    
    toast.innerHTML = `
      <span class="toast-icon"><i class="fas fa-${icon}"></i></span>
      <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove the toast after 4 seconds
    setTimeout(() => {
      toast.remove();
    }, 4000);
  };
  
  /**
   * Filter the table based on search input
   */
  const filterTable = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = peopleTableBody.querySelectorAll('tr');
    
    let visibleCount = 0;
    
    rows.forEach(row => {
      const name = row.children[0].textContent.toLowerCase();
      
      if (name.includes(searchTerm)) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });
    
    // Show empty state if no results
    if (visibleCount === 0 && rows.length > 0) {
      emptyState.classList.remove('hidden');
      emptyState.querySelector('p').textContent = 'No matching results found.';
    } else {
      emptyState.classList.add('hidden');
    }
  };
  
  // Event Listeners
  personForm.addEventListener('submit', handleFormSubmit);
  cancelBtn.addEventListener('click', resetForm);
  addNewBtn.addEventListener('click', () => {
    resetForm();
    document.querySelector('.person-form-container').scrollIntoView({ behavior: 'smooth' });
  });
  
  // Modal event listeners
  closeModalBtn.addEventListener('click', closeDeleteModal);
  confirmDeleteBtn.addEventListener('click', deletePerson);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  
  // Search input event listener
  searchInput.addEventListener('input', filterTable);
  
  // Initial load
  loadPeople();
});