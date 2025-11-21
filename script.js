const nameInput = document.getElementById('nameInput');
const numberInput = document.getElementById('numberInput');
const addBtn = document.getElementById('addBtn');
const contactList = document.getElementById('contactList');

let contacts = [];
let editingId = null;

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
        alert('Please enter both name and number');
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
    if (confirm('Are you sure you want to delete this contact?')) {
        contacts = contacts.filter(function(contact) {
            return contact.id !== id;
        });
        saveContacts();
        displayContacts();
    }
}

// Load contacts when page loads
loadContacts();
