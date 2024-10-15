// Define submitForm function
async function submitForm(event) {
    event.preventDefault(); // Prevent form submission

    // Add the 'active-hover' class to keep hover state after submission
    const submitButton = document.querySelector(".submit-button");
    submitButton.classList.add("active-hover");

    const fileInput = document.getElementById('picture');
    const file = fileInput.files[0];
  
    // Show loader and change button text
    document.getElementById('submit-text').innerText = 'Please wait...';
    document.getElementById('loader').style.display = 'inline-block';

    const whatsappNumber = document
        .getElementById("whatsapp-number")
        .value.replace(/[\s+]/g, ""); // Remove spaces and '+' sign
  
    // Collect form data
    const formData = {
        Name: document.getElementById('name').value,
        Nickname: document.getElementById('nickname').value,
        "Whatsapp Number": whatsappNumber,
        Email: document.getElementById('email').value,
        "Date of Birth": document.getElementById('dob').value,
        Picture: [{ url: '' }] // Placeholder for the Cloudinary URL
    };

    console.log('Form Data:', formData); // Log form data
  
    if (!validateForm(formData, file)) {
        // Hide loader and reset button text
        document.getElementById('submit-text').innerText = 'Submit';
        document.getElementById('loader').style.display = 'none';
        submitButton.classList.remove("active-hover");
        return;
    }
  
    try {
        // Upload image to Cloudinary
        const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload';
        const formDataCloudinary = new FormData();
        formDataCloudinary.append('file', file);
        formDataCloudinary.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // Set Cloudinary upload preset
  
        const cloudinaryResponse = await fetch(cloudinaryUrl, {
            method: 'POST',
            body: formDataCloudinary,
        });
  
        if (!cloudinaryResponse.ok) {
            throw new Error('Error uploading image to Cloudinary.');
        }
  
        const cloudinaryData = await cloudinaryResponse.json();
        formData.Picture[0].url = cloudinaryData.secure_url; // Update the Picture URL in the formData object
  
        // Send form data to Airtable via API
        const airtableResponse = await fetch('https://api.airtable.com/v0/YOUR_AIRTABLE_BASE_ID/YOUR_AIRTABLE_TABLE_NAME', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_AIRTABLE_API_KEY'
            },
            body: JSON.stringify({
                records: [
                    {
                        fields: formData
                    }
                ]
            })
        });
  
        if (!airtableResponse.ok) {
            throw new Error('Error submitting form to Airtable.');
        }
  
        const result = await airtableResponse.json();

        console.log('Form submission response:', result); // Log response from backend
  
        // Display confirmation message
        showPopup(); // Call showPopup function if form submission is successful
        document.getElementById('submit-text').innerText = 'Submit';
        document.getElementById('loader').style.display = 'none';
        submitButton.classList.remove("active-hover"); // Remove hover state once submitted
        // Reset the form
        document.getElementById('form').reset();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form: ' + error.message); // Show error message with full error details
        document.getElementById('submit-text').innerText = 'Submit';
        document.getElementById('loader').style.display = 'none';
        submitButton.classList.remove("active-hover"); // Remove hover state on error
    }
}
  
// Function to check if email exists in Airtable
async function checkUserDataExists(email) {
    const response = await fetch(`https://api.airtable.com/v0/YOUR_AIRTABLE_BASE_ID/YOUR_AIRTABLE_TABLE_NAME?filterByFormula=SEARCH('${email}', Email)`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer YOUR_AIRTABLE_API_KEY'
        }
    });
  
    if (!response.ok) {
        throw new Error('Error checking user data');
    }
    
    const data = await response.json();
    console.log('User data check response:', data); // Log response from Airtable
  
    return data.records.length > 0; // Returns true if email exists, false otherwise
}
  
// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
    const loginPopup = document.getElementById('login-popup');
    const continueButton = document.getElementById('continue-button');
    const loginEmailInput = document.getElementById('login-email');
  
    // Show login popup on page load
    loginPopup.style.display = 'flex';
  
    // Function to handle the button click logic
    continueButton.addEventListener('click', async function () {
        const email = loginEmailInput.value.trim();

        if (email === '') {
            document.getElementById('continual').innerText = 'Please enter your email!';
            return;
        }

        continueButton.innerHTML = '<div id="loader"></div>';

        // Check if email exists in Airtable
        const userDataExists = await checkUserDataExists(email);

        if (userDataExists) {
            // Display already registered message
            document.getElementById('giffy').src = 'images/giphy.webp';
            document.getElementById('continual').innerText = 'You have already registered.';
            document.getElementById('login-input').style.display = "none";
            // Change continue button text to OK and reload page on click
            continueButton.innerHTML = 'OK <img class="rocket" src="images/rocket.png" alt="">';
            continueButton.addEventListener('click', function () {
                location.reload();
            });
            continueButton.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    location.reload();
                }
            });
  
        } else {
            // Hide login popup and allow user to continue with registration
            loginPopup.style.display = 'none';
            // Auto-fill email input field in registration form
            const autoFilledEmail = document.getElementById('email');
            autoFilledEmail.value = email;
            autoFilledEmail.disabled = true;
        }
    });
});
  
// Function to format WhatsApp number input
const inputField = document.getElementById('whatsapp-number');
inputField.addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^\d+]/g, ''); // Remove non-numeric characters
   
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i === 0 && value[i] !== '+') {
            formattedValue = '+234'; // Ensure the prefix is always present
        } else if (i === 4 && value[i] === '0') {
            continue; // Skip adding the leading '0'
        }
        formattedValue += value[i];
    }
  
    // Limit input to 14 characters after formatting
    if (formattedValue.length > 16) {
        formattedValue = formattedValue.substr(0, 16);
    }
    // Add "+234" prefix if the input field is empty
    if (e.target.value === '') {
        formattedValue = '+234';
    }
  
    e.target.value = formattedValue;
});

// Validate WhatsApp Number, Email, and Picture
function validateForm(formData, file) {
    const number = formData["Whatsapp Number"];
    const email = formData["Email"];
  
    // WhatsApp number validation
    // if (!(/^\+\d{13}$/.test(number))) {
    //     alert('Please enter a valid WhatsApp number with country code (+234)');
    //     return false;
    // }
  
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
  
    // Picture validation
    if (!file || !['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert('Please upload an image file (JPG, JPEG, PNG, GIF).');
        return false;
    }
  
    return true;
}
  
// Show the popup when the form is successfully submitted
function showPopup() {
    const popupOverlay = document.querySelector('.popup-overlay');
    popupOverlay.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('form').addEventListener('submit', submitForm);

    // Listen for Enter key press to trigger form submission
    form.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default Enter behavior
            submitForm(event); // Call submitForm function
        }
    });

    // Get the Date of Birth input
    const dobInput = document.getElementById("dob");
    dobInput.addEventListener("click", function () {
        dobInput.showPicker(); // Display the date picker when clicked
    });
});
