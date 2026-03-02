document.addEventListener('DOMContentLoaded', () => {
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

    // Phone Form Simulation
    phoneForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const phone = phoneNumberInput.value.trim();
        if (phone.length < 10) return;

        // UI Loading State
        setButtonLoading(sendOtpBtn, true, 'Sending...');

        // Simulate network request
        setTimeout(() => {
            setButtonLoading(sendOtpBtn, false, 'Send OTP');

            // Format phone for display
            displayPhone.textContent = `+91 ${phone.substring(0, 5)} ${phone.substring(5)}`;

            // Transition to OTP step
            stepPhone.classList.remove('step-active');
            stepOtp.classList.add('step-active');

            // Focus first OTP box and start timer
            otpBoxes[0].focus();
            startTimer(30);
        }, 800);
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

    // Verify Form Simulation
    otpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Ensure all boxes are filled
        const otpCompleted = Array.from(otpBoxes).every(box => box.value !== '');
        if (!otpCompleted) return;

        setButtonLoading(verifyOtpBtn, true, 'Verifying...');

        setTimeout(() => {
            setButtonLoading(verifyOtpBtn, false, 'Verify & Continue');
            // Simulate saving auth token
            // localStorage.setItem("desi_auth", "true");
            window.location.href = 'home.html';
        }, 1200);
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
