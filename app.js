// Firebase configuration (REPLACE WITH YOUR ACTUAL FIREBASE CONFIG)
const firebaseConfig = {
    apiKey: "AIzaSyC_Iqy4WrYeIY0kcFJThCimU2z0CUSliHs",
    authDomain: "desichulha-b6b9a.firebaseapp.com",
    projectId: "desichulha-b6b9a",
    storageBucket: "desichulha-b6b9a.firebasestorage.app",
    messagingSenderId: "875626400095",
    appId: "1:875626400095:web:914d32cfa82e1bce34ceea"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

document.addEventListener('DOMContentLoaded', () => {
    let currentPhone = '';
    let confirmationResult = null;

    // Initialize Recaptcha Verifier
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
            // reCAPTCHA solved
        }
    });

    // Elements
    const phoneForm = document.getElementById('phone-form');
    const otpForm = document.getElementById('otp-form');
    const stepPhone = document.getElementById('step-phone');
    const stepOtp = document.getElementById('step-otp');
    const phoneNumberInput = document.getElementById('phone-number');
    const displayPhone = document.getElementById('display-phone');
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const verifyOtpBtn = document.getElementById('verify-otp-btn');
    const editPhoneBtn = document.getElementById('edit-phone-btn');
    const timerDisplay = document.getElementById('timer');
    const otpBoxes = document.querySelectorAll('.otp-box');
    const devLoginBtn = document.getElementById('dev-login-btn');

    // ==========================================
    // DEVELOPMENT LOGIN (Remove before Production)
    // ==========================================
    if (devLoginBtn) {
        devLoginBtn.addEventListener('click', () => {
            console.warn("🔐 DEV MODE LOG IN INITIATED. Skipping OTP.");
            localStorage.setItem("desi_auth_token", "DEV_USER_TEST_ID_12345");
            window.location.href = 'user/pages/home.html';
        });
    }

    // Phone Form Submission (Firebase Phone Auth)
    phoneForm.addEventListener('submit', (e) => {
        e.preventDefault();

        currentPhone = phoneNumberInput.value.trim();
        if (currentPhone.length < 10) return;

        // UI Loading State
        setButtonLoading(sendOtpBtn, true, 'Sending...');

        const phoneNumber = `+91${currentPhone}`;
        const appVerifier = window.recaptchaVerifier;

        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((result) => {
                // SMS sent. Prompt user to type the code from the message structure
                confirmationResult = result;

                setButtonLoading(sendOtpBtn, false, 'Send OTP');

                // Format phone for display
                displayPhone.textContent = `+91 ${currentPhone.substring(0, 5)} ${currentPhone.substring(5)}`;

                // Transition to OTP step
                stepPhone.classList.remove('step-active');
                stepOtp.classList.add('step-active');

                // Focus first OTP box and start timer
                otpBoxes[0].focus();
                startTimer(30);
            }).catch((error) => {
                setButtonLoading(sendOtpBtn, false, 'Send OTP');
                console.error("Error sending OTP:", error);

                // Reset recaptcha if error occurs
                if (window.recaptchaVerifier) window.recaptchaVerifier.render().then(function (widgetId) {
                    window.grecaptcha.reset(widgetId);
                });

                alert("Failed to send OTP. " + (error.message || "Please try again. Make sure Firebase Config is correct."));
            });
    });

    // OTP Input Logic (Auto-focusing)
    otpBoxes.forEach((box, index) => {
        box.addEventListener('input', (e) => {
            // Allow only numbers
            e.target.value = e.target.value.replace(/[^0-9]/g, '');

            // Move to next input if filled
            if (e.target.value !== '') {
                if (index < otpBoxes.length - 1) {
                    otpBoxes[index + 1].focus();
                }
            }
        });

        box.addEventListener('keydown', (e) => {
            // Move to previous input on Backspace
            if (e.key === 'Backspace' && e.target.value === '') {
                if (index > 0) {
                    otpBoxes[index - 1].focus();
                }
            }
        });

        // Paste OTP functionality (if user pastes 4 digits)
        box.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').trim();
            const numericData = pastedData.replace(/[^0-9]/g, '');

            if (numericData.length > 0) {
                let currentBox = index;
                for (let i = 0; i < numericData.length; i++) {
                    if (currentBox < otpBoxes.length) {
                        otpBoxes[currentBox].value = numericData[i];
                        otpBoxes[currentBox].focus();
                        currentBox++;
                    }
                }
            }
        });
    });

    // Verify Form Submission (Firebase Phone Auth)
    otpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Ensure all boxes are filled
        const otpCompleted = Array.from(otpBoxes).every(box => box.value !== '');
        if (!otpCompleted) return;

        const otpCode = Array.from(otpBoxes).map(box => box.value).join('');
        setButtonLoading(verifyOtpBtn, true, 'Verifying...');

        if (!confirmationResult) {
            setButtonLoading(verifyOtpBtn, false, 'Verify & Continue');
            alert("Please request OTP first.");
            return;
        }

        confirmationResult.confirm(otpCode).then((result) => {
            // User signed in successfully.
            const user = result.user;
            setButtonLoading(verifyOtpBtn, false, 'Verify & Continue');

            // Save local auth state if needed and redirect
            localStorage.setItem("desi_auth_token", user.uid);
            window.location.href = 'user/pages/home.html';
        }).catch((error) => {
            // User couldn't sign in (bad verification code?)
            setButtonLoading(verifyOtpBtn, false, 'Verify & Continue');
            console.error("Error verifying OTP:", error);
            alert("Invalid OTP code. Please try again.");
            otpBoxes.forEach(box => box.value = ''); // Clear on error
            otpBoxes[0].focus();
        });
    });

    // Navigation - Back to Phone Input
    editPhoneBtn.addEventListener('click', (e) => {
        e.preventDefault();
        stepOtp.classList.remove('step-active');
        stepPhone.classList.add('step-active');
        phoneNumberInput.focus();

        // Clear OTP inputs
        otpBoxes.forEach(box => box.value = '');
    });

    // Utility Functions
    function setButtonLoading(button, isLoading, text) {
        const btnText = button.querySelector('.btn-text');
        const loader = button.querySelector('.loader');

        if (isLoading) {
            button.disabled = true;
            btnText.textContent = text;
            loader.classList.remove('hidden');
        } else {
            button.disabled = false;
            btnText.textContent = text;
            loader.classList.add('hidden');
        }
    }

    let timerInterval;
    function startTimer(duration) {
        let timer = duration;
        clearInterval(timerInterval);

        // Reset timer display state
        timerDisplay.parentElement.innerHTML = `Resend OTP in <span id="timer">${timer}s</span>`;
        let newTimerDisplay = document.getElementById('timer');

        timerInterval = setInterval(() => {
            timer--;
            newTimerDisplay.textContent = `${timer}s`;

            if (timer <= 0) {
                clearInterval(timerInterval);
                newTimerDisplay.parentElement.innerHTML = `<span class="resend-link" id="resend-link">Resend OTP now</span>`;

                // Add listener to new resend link
                document.getElementById('resend-link').addEventListener('click', () => {
                    startTimer(30); // reset timer
                });
            }
        }, 1000);
    }
});
