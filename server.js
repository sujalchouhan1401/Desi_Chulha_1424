const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Twilio client using environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Store OTPs temporarily in memory (In production: Use Redis or Database)
const otpStore = {};

// Optional: check if Twilio is configured, otherwise simulate
const isTwilioConfigured = accountSid && accountSid.startsWith('AC') && authToken && twilioPhoneNumber;
if (isTwilioConfigured) {
    var client = new twilio(accountSid, authToken);
} else {
    console.warn("⚠️ Valid Twilio credentials missing in .env! SMS will be simulated in the console.");
}

// Generate random 4 digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// 1. Send OTP Endpoint
app.post('/api/send-otp', async (req, res) => {
    const { phone } = req.body;

    if (!phone || phone.length < 10) {
        return res.status(400).json({ success: false, message: 'Valid phone number is required.' });
    }

    // Standardize phone format (assuming India +91 for this project)
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const otp = generateOTP();

    // Save OTP to memory store, valid for 5 mins (300000ms)
    otpStore[formattedPhone] = { otp, expiry: Date.now() + 300000 };

    if (isTwilioConfigured) {
        try {
            await client.messages.create({
                body: `Your Desi Chulha login OTP is: ${otp}. Valid for 5 minutes.`,
                to: formattedPhone,
                from: twilioPhoneNumber
            });
            console.log(`[TWILIO SUCCESS] Sent OTP to ${formattedPhone}`);
            return res.json({ success: true, message: 'OTP sent successfully!' });
        } catch (error) {
            console.error(`[TWILIO ERROR] Failed to send OTP: `, error);
            // Fallback to simulation if Twilio fails (e.g., unverified number on trial account)
            console.log(`[SIMULATION FALLBACK] OTP for ${formattedPhone} is: ${otp}`);
            return res.json({ success: true, message: 'OTP sent! (Simulated fallback due to API error)', simulated: true });
        }
    } else {
        // Simulation mode
        console.log(`\n============================`);
        console.log(`📱 MOCK SMS TO: ${formattedPhone}`);
        console.log(`🔑 OTP CODE: ${otp}`);
        console.log(`============================\n`);
        return res.json({ success: true, message: 'OTP simulated successfully! Check server console.', simulated: true });
    }
});

// 2. Verify OTP Endpoint
app.post('/api/verify-otp', (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ success: false, message: 'Phone and OTP are required.' });
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const record = otpStore[formattedPhone];

    if (!record) {
        return res.status(400).json({ success: false, message: 'No OTP requested for this number.' });
    }

    if (Date.now() > record.expiry) {
        delete otpStore[formattedPhone];
        return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (record.otp === otp) {
        // Correct OTP! Clear it from memory and authenticate
        delete otpStore[formattedPhone];
        return res.json({ success: true, message: 'OTP verified successfully.', token: 'dummy_jwt_auth_token_here' });
    } else {
        return res.status(400).json({ success: false, message: 'Invalid OTP provided.' });
    }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Desi Chulha API is running on http://localhost:${PORT}`);
});
