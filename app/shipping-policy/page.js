import React from 'react';

export default function ShippingPolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', lineHeight: '1.6' }}>
      <h1>Shipping Policy</h1>
      <h3>Order Processing</h3>
      <p>All orders are processed within <strong>1–3 business days</strong> after payment confirmation.</p>
      <h3>Delivery Time</h3>
      <p>Estimated delivery time is <strong>3–7 business days</strong> within India.</p>
      <p>Tracking IDs are sent via SMS/Email once the order is shipped.</p>
    </div>
  );
}
