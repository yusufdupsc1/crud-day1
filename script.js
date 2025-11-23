const nameInput = document.getElementById('nameInput');
const numberInput = document.getElementById('numberInput');
const addressInput = document.getElementById('addressInput');
const addBtn = document.getElementById('addBtn');
const contactList = document.getElementById('contactList');
const toastContainer = document.getElementById('toastContainer');

// Details Modal
const modal = document.getElementById('contactModal');
const closeModal = document.getElementById('closeModal');
const modalAvatar = document.getElementById('modalAvatar');
const modalName = document.getElementById('modalName');
const modalNumber = document.getElementById('modalNumber');
const modalAddress = document.getElementById('modalAddress');

// Edit Modal
const editModal = document.getElementById('editModal');
const closeEditModal = document.getElementById('closeEditModal');
const editModalAvatar = document.getElementById('editModalAvatar');
const editNameInput = document.getElementById('editNameInput');
const editNumberInput = document.getElementById('editNumberInput');
const editAddressInput = document.getElementById('editAddressInput');
const saveEditBtn = document.getElementById('saveEditBtn');

let contacts = [];
let editingId = null;
let isFirstLoad = true; // Track if it's the first time loading

// Details Modal functions
function openModal(id) {
    const contact = contacts.find(function(c) {
        return c.id === id;
    });
    
    if (contact) {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        modalAvatar.textContent = firstLetter;
        modalName.textContent = contact.name;
        modalNumber.textContent = contact.number;
        modalAddress.textContent = contact.address || 'No address added';
        modal.classList.add('show');
    }
}

function closeModalFunc() {
    modal.classList.remove('show');
}

// Close modal on button click
closeModal.addEventListener('click', closeModalFunc);

// Close modal when clicking outside
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModalFunc();
    }
});

// Edit Modal functions
function openEditModal(id) {
    const contact = contacts.find(function(c) {
        return c.id === id;
    });
    
    if (contact) {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        editModalAvatar.textContent = firstLetter;
        editNameInput.value = contact.name;
        editNumberInput.value = contact.number;
        editAddressInput.value = contact.address || '';
        editingId = id;
        editModal.classList.add('show');
    }
}

function closeEditModalFunc() {
    editModal.classList.remove('show');
    editingId = null;
}

// Close edit modal on button click
closeEditModal.addEventListener('click', closeEditModalFunc);

// Close edit modal when clicking outside
editModal.addEventListener('click', function(e) {
    if (e.target === editModal) {
        closeEditModalFunc();
    }
});

// Save edited contact
saveEditBtn.addEventListener('click', function() {
    const name = editNameInput.value.trim();
    const number = editNumberInput.value.trim();
    const address = editAddressInput.value.trim();
    
    if (name === '' || number === '' || address === '') {
        showToast('error', 'Error', 'Please enter name, number and address');
        return;
    }
    
    // Update contact
    contacts = contacts.map(function(contact) {
        if (contact.id === editingId) {
            return {
                id: editingId,
                name: name,
                number: number,
                address: address
            };
        }
        return contact;
    });
    
    saveContacts();
    displayContacts();
    closeEditModalFunc();
    showToast('success', 'Contact Updated', 'Contact updated successfully');
});

// Toast Notification System
function showToast(type, title, message, actions) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Get icon based on type
    let icon = '';
    if (type === 'success') icon = '✓';
    if (type === 'warning') icon = '⚠';
    if (type === 'error') icon = '✕';
    
    // Build toast HTML
    let html = `
        <div class="toast-header">
            <div class="toast-icon">${icon}</div>
            <div class="toast-title">${title}</div>
        </div>
    `;
    
    if (message) {
        html += `<div class="toast-message">${message}</div>`;
    }
    
    if (actions) {
        html += `<div class="toast-actions">`;
        actions.forEach(function(action) {
            html += `<button class="toast-btn toast-btn-${action.type}">${action.text}</button>`;
        });
        html += `</div>`;
    }
    
    toast.innerHTML = html;
    toastContainer.appendChild(toast);
    
    // Handle action buttons
    if (actions) {
        const buttons = toast.querySelectorAll('.toast-btn');
        buttons.forEach(function(button, index) {
            button.addEventListener('click', function() {
                actions[index].onClick();
                hideToast(toast);
            });
        });
    } else {
        // Auto hide after 3 seconds for non-action toasts
        setTimeout(function() {
            hideToast(toast);
        }, 3000);
    }
}

function hideToast(toast) {
    toast.classList.add('hiding');
    setTimeout(function() {
        toast.remove();
    }, 300);
}

function showDeleteConfirmation(id) {
    showToast('warning', 'Delete Contact', 'Are you sure you want to delete this contact?', [
        {
            text: 'Delete',
            type: 'confirm',
            onClick: function() {
                // Actually delete the contact
                contacts = contacts.filter(function(contact) {
                    return contact.id !== id;
                });
                saveContacts();
                displayContacts();
                showToast('success', 'Deleted', 'Contact deleted successfully');
            }
        },
        {
            text: 'Cancel',
            type: 'cancel',
            onClick: function() {
                // Just close the toast
            }
        }
    ]);
}

// Load contacts from localStorage
function loadContacts() {
    const saved = localStorage.getItem('contacts');
    if (saved) {
        contacts = JSON.parse(saved);
    }
    displayContacts();
}

// Save contacts to localStorage
function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Display all contacts
function displayContacts() {
    contactList.innerHTML = '';
    
    // Reverse array to show newest first
    const reversedContacts = contacts.slice().reverse();
    
    reversedContacts.forEach(function(contact, index) {
        const contactDiv = document.createElement('div');
        contactDiv.className = 'contact-item';
        
        // Get first letter of name for avatar
        const firstLetter = contact.name.charAt(0).toUpperCase();
        
        contactDiv.innerHTML = `
            <div class="contact-info" onclick="openModal(${contact.id})">
                <div class="contact-avatar">${firstLetter}</div>
                <div class="contact-details">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-number">${contact.number}</div>
                    <div class="contact-address">${contact.address || ''}</div>
                </div>
            </div>
            <div class="contact-actions">
                <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        `;
        contactList.appendChild(contactDiv);
        
        // Only animate on first load
        if (isFirstLoad) {
            setTimeout(function() {
                contactDiv.classList.add('slide-in');
            }, index * 100);
        }
    });
    
    // After first load, disable animations
    if (isFirstLoad) {
        isFirstLoad = false;
    }
}

// Add contact
addBtn.addEventListener('click', function() {
    const name = nameInput.value.trim();
    const number = numberInput.value.trim();
    const address = addressInput.value.trim();
    
    if (name === '' || number === '' || address === '') {
        showToast('error', 'Error', 'Please enter name, number and address');
        return;
    }
    
    // Add new contact
    const newContact = {
        id: Date.now(),
        name: name,
        number: number,
        address: address
    };
    contacts.push(newContact);
    showToast('success', 'Contact Added', 'New contact added successfully');
    
    saveContacts();
    displayContacts();
    nameInput.value = '';
    numberInput.value = '';
    addressInput.value = '';
});

// Edit contact - now opens modal
function editContact(id) {
    openEditModal(id);
}

// Delete contact
function deleteContact(id) {
    showDeleteConfirmation(id);
}

// Load contacts when page loads
loadContacts();
