import React from 'react';

export default function ShippingPolicy() {
  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '40px auto',
        padding: '30px',
        lineHeight: '1.8',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <h1
        style={{
          color: '#2e7d32',
          borderBottom: '2px solid #2e7d32',
          paddingBottom: '10px'
        }}
      >
        Shipping Policy
      </h1>

      <h3 style={{ color: '#2e7d32' }}>Order Processing</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li>
          All orders are processed within <strong>1-3 business days</strong>{' '}
          after payment confirmation.
        </li>
        <li>Orders are not shipped or delivered on weekends or holidays.</li>
        <li>
          In case of high order volume, shipments may be delayed slightly. We
          will notify you via email or SMS if there is a significant delay.
        </li>
      </ul>

      <h3 style={{ color: '#2e7d32' }}>Shipping Charges</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li>
          Shipping charges are calculated at checkout based on your location and
          the total weight of the order.
        </li>
        <li>
          Free shipping may be available on selected products or during specific
          promotional offers.
        </li>
      </ul>

      <h3 style={{ color: '#2e7d32' }}>Delivery Time</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li>
          Estimated delivery time is <strong>3-7 business days</strong> within
          India.
        </li>
        <li>
          Please note that delivery times may vary depending on your specific
          location and courier service availability.
        </li>
      </ul>

      <h3 style={{ color: '#2e7d32' }}>Shipment Tracking</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li>
          Once your order has been dispatched, you will receive a tracking ID via
          SMS and email.
        </li>
        <li>
          You can track your shipment in real-time using the provided tracking
          link.
        </li>
      </ul>

      <h3 style={{ color: '#2e7d32' }}>Delivery Issues</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li>
          If your order is delayed, lost, or received in a damaged condition
          during transit, please contact us immediately at{' '}
          <strong>support@cerealswale.com</strong>.
        </li>
        <li>
          We will coordinate with our courier partners to resolve the issue as
          quickly as possible.
        </li>
      </ul>

      <h3 style={{ color: '#2e7d32' }}>Incorrect Address</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li>
          Please ensure that your shipping address is accurate and complete at
          the time of checkout.
        </li>
        <li>
          <strong>CATALYST SERVICE PRIVATE LIMITED</strong> is not responsible
          for orders delivered to incorrect addresses provided by the customer.
        </li>
      </ul>

      <h3 style={{ color: '#2e7d32' }}>Partial Shipments</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li>
          In some cases, your order may be shipped in multiple packages depending
          on product availability and warehouse locations.
        </li>
      </ul>

      <h3 style={{ color: '#2e7d32' }}>Changes & Cancellations</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li>
          Orders can be modified or canceled within{' '}
          <strong>12-24 hours</strong> of placement.
        </li>
        <li>
          Once an order has been shipped, it cannot be canceled and must follow
          our standard return process.
        </li>
      </ul>

      <hr />

      <h3 style={{ color: '#2e7d32' }}>Contact Us</h3>
      <p>
        If you have any questions regarding your shipping or delivery, please
        feel free to reach out to us:
      </p>

      <div
        style={{
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '5px',
          margin: '20px 0',
          borderLeft: '5px solid #2e7d32'
        }}
      >
        <p>
          <strong>CATALYST SERVICE PRIVATE LIMITED</strong>
          <br />
          <strong>Office Address:</strong> Office No 505, Juhi Niharika Mirage,
          Kharghar Sector 10, District Raigarh, Navi Mumbai, Maharashtra -
          410210
          <br />
          <strong>Phone:</strong> +91-2231430562
          <br />
          <strong>Email:</strong> support@cerealswale.com
        </p>
      </div>
    </div>
  );
}
