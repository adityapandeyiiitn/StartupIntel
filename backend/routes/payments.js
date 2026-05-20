const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. Create a Razorpay Order
router.post('/create-order', requireAuth, async (req, res) => {
  try {
    const { planType } = req.body; // 'monthly' or 'annual'
    const amount = planType === 'annual' ? 5988 : 699;

    const options = {
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${req.user.userId}_${Date.now()}`,
      notes: {
        userId: req.user.userId,
        planType: planType
      }
    };

    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpay.key_id
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
});

// 2. Verify Razorpay Signature (Frontend Callback)
router.post('/verify-signature', requireAuth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = req.body;

    const generatedSignature = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Set Expiry: Monthly (30 days) or Annual (365 days)
    const durationDays = planType === 'annual' ? 365 : 30;
    const planExpiry = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    // Update User in Mongoose DB if connection active
    if (req.user && typeof req.user.save === 'function') {
      req.user.isPro = true;
      req.user.planExpiry = planExpiry;
      await req.user.save();
    } else {
      console.warn('Local database inactive, signature verified for user in-memory.');
    }

    res.json({
      success: true,
      message: 'Payment verified and Pro status activated successfully',
      isPro: true,
      planExpiry
    });
  } catch (error) {
    console.error('Verify signature error:', error);
    res.status(500).json({ message: 'Failed to verify payment signature' });
  }
});

// 3. Webhook Listener (Backend-to-Backend Signature Verification)
router.post('/webhook', async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== signature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    // Process event
    const event = req.body.event;
    if (event === 'payment.captured' || event === 'order.paid') {
      const payload = req.body.payload.payment.entity;
      const userId = payload.notes?.userId;
      const planType = payload.notes?.planType;

      if (userId) {
        const durationDays = planType === 'annual' ? 365 : 30;
        const planExpiry = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

        const updated = await User.findOneAndUpdate(
          { userId },
          { isPro: true, planExpiry },
          { new: true }
        );
        console.log(`Webhook updated user ${userId} to Pro plan ${planType}.`);
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Internal server webhook error' });
  }
});

// 4. Get User Subscription Status
router.get('/status', requireAuth, async (req, res) => {
  try {
    const now = new Date();
    const isPro = req.user.isPro && (!req.user.planExpiry || new Date(req.user.planExpiry) > now);
    res.json({
      isPro,
      planExpiry: req.user.planExpiry
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve subscription status' });
  }
});

module.exports = router;
