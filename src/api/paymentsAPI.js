import API from './axios';

// Create Stripe payment intent
export const createStripePayment = async (orderId, amount) => {
  try {
    const res = await API.post('/payments/stripe', { orderId, amount });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Create Razorpay order
export const createRazorpayOrder = async (orderId, amount) => {
  try {
    const res = await API.post('/payments/razorpay', { orderId, amount });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (orderId, razorpay_payment_id, razorpay_signature) => {
  try {
    const res = await API.post('/payments/verify-razorpay', {
      orderId,
      razorpay_payment_id,
      razorpay_signature
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Create COD order
export const createCODOrder = async (orderId) => {
  try {
    const res = await API.post('/payments/cod', { orderId });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get payment status
export const getPaymentStatus = async (orderId) => {
  try {
    const res = await API.get(`/payments/status/${orderId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
