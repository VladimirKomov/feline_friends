// Get the form by id
const registerForm = document.getElementById('register');

const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm_password');
const passwordError = document.getElementById('password-error');

// Check password match on input
confirmPassword.addEventListener('input', function() {
    if (password.value !== confirmPassword.value) {
        passwordError.textContent = "Passwords do not match!";
    } else {
        passwordError.textContent = "";
    }
});

// Add submit handler for the form
registerForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form behavior (page reload)
    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match!");
        return;
    }

    // Collect form data into an object
    const formData = {
        name: document.getElementById('name').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: password.value
    };

    try {
        // Send request to the server
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // Process server response
        const result = await response.json();
        console.log(result);

        if (response.ok) {
            Swal.fire({
                title: 'Success!',
                text: 'Registration successful!',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'custom-success-popup',
                    confirmButton: 'custom-confirm-button'
                }
            }).then(() => {
                // After closing the modal, redirect to index.html
                //DON'T FORGET TO CHANGE!!!!!!!!!!!!!!
                window.location.href = '/index.html';
            });
        } else {
            // If the server returned an error
            console.log(result.error)
            Swal.fire({
                title: 'Error!',
                text: 'Registration failed: ' + result.error,
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'custom-error-popup',
                    confirmButton: 'custom-error-button'
                }
            });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        Swal.fire({
            title: 'Error!',
            text: 'An error occurred during registration.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'custom-error-button'
            }
        });
    }
});
