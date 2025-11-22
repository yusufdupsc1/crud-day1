const nameInput = document.getElementById('nameInput');
const numberInput = document.getElementById('numberInput');
const addBtn = document.getElementById('addBtn');
const contactList = document.getElementById('contactList');
const toastContainer = document.getElementById('toastContainer');

let contacts = [];
let editingId = null;

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
    contacts.forEach(function(contact) {
        const contactDiv = document.createElement('div');
        contactDiv.className = 'contact-item';
        contactDiv.innerHTML = `
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-number">${contact.number}</div>
            </div>
            <div class="contact-actions">
                <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        `;
        contactList.appendChild(contactDiv);
    });
}

// Add or update contact
addBtn.addEventListener('click', function() {
    const name = nameInput.value.trim();
    const number = numberInput.value.trim();
    
    if (name === '' || number === '') {
        showToast('error', 'Error', 'Please enter both name and number');
        return;
    }
    
    if (editingId === null) {
        // Add new contact
        const newContact = {
            id: Date.now(),
            name: name,
            number: number
        };
        contacts.push(newContact);
        showToast('success', 'Contact Added', 'New contact added successfully');
    } else {
        // Update existing contact
        contacts = contacts.map(function(contact) {
            if (contact.id === editingId) {
                return {
                    id: editingId,
                    name: name,
                    number: number
                };
            }
            return contact;
        });
        editingId = null;
        addBtn.textContent = 'Add Contact';
        showToast('success', 'Contact Updated', 'Contact updated successfully');
    }
    
    saveContacts();
    displayContacts();
    nameInput.value = '';
    numberInput.value = '';
});

// Edit contact
function editContact(id) {
    const contact = contacts.find(function(c) {
        return c.id === id;
    });
    
    if (contact) {
        nameInput.value = contact.name;
        numberInput.value = contact.number;
        editingId = id;
        addBtn.textContent = 'Update Contact';
    }
}

// Delete contact
function deleteContact(id) {
    showDeleteConfirmation(id);
}

// Load contacts when page loads
loadContacts();
