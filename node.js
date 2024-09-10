const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());

// Generate M-Pesa access token
async function getMpesaAccessToken() {
  const consumer_key = process.env.MPESA_CONSUMER_KEY;
  const consumer_secret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');

  const { data } = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  return data.access_token;
}

// Handle STK Push
app.post('/mpesa-stk-push', async (req, res) => {
  const { phone, amount, checkIn, checkOut, persons } = req.body;
  
  const accessToken = await getMpesaAccessToken();
  const shortCode = process.env.MPESA_SHORTCODE;
  const passKey = process.env.MPESA_PASSKEY;
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);

  const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString('base64');
  const transactionType = 'CustomerPayBillOnline';
  const partyA = phone;
  const partyB = shortCode;
  const phoneNumber = phone;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;
  const accountReference = `Booking-${checkIn}-${checkOut}`;
  const transactionDesc = `Payment for booking (${persons} persons)`;

  const stkPushPayload = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: transactionType,
    Amount: amount,
    PartyA: partyA,
    PartyB: partyB,
    PhoneNumber: phoneNumber,
    CallBackURL: callbackUrl,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc,
  };

  try {
    const { data } = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', stkPushPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (data.ResponseCode === "0") {
      res.status(200).json({
        success: true,
        message: "STK Push initiated successfully.",
        data: data,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to initiate STK Push.",
        data: data,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while initiating STK Push.",
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
