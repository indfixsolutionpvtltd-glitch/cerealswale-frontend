import React from 'react';

export default function RefundPolicy() {
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
        Refund Policy
      </h1>

      <p>
        Thank you for shopping with{' '}
        <strong>CATALYST SERVICE PRIVATE LIMITED</strong>, your trusted online
        partner for agricultural and cereal products. We want you to be fully
        satisfied with every purchase you make from our website{' '}
        <a href="https://www.cerealswale.com/" style={{ color: '#2e7d32' }}>
          https://www.cerealswale.com/
        </a>
        .
      </p>

      <p>
        If you are not completely happy with your order, please review our return
        and refund policy below.
      </p>

      <hr />

      <h3 style={{ color: '#2e7d32' }}>1. Returns Eligibility</h3>
      <p>We accept returns under the following conditions:</p>

      <ul style={{ paddingLeft: '20px' }}>
        <li>The product is defective, damaged, or not as described.</li>
        <li>
          The return request is raised within <strong>5-7 days</strong> of
          delivery.
        </li>
        <li>
          The product must be unused, undamaged, and in its original packaging.
        </li>
        <li>
          Items not meeting these conditions may not be eligible for a return or
          refund.
        </li>
      </ul>

      <h3 style={{ color: '#2e7d32' }}>2. Non-Returnable Items</h3>
      <p>
        For safety and hygiene reasons, certain agricultural items cannot be
        returned unless received in a damaged or defective condition.
      </p>

      <h3 style={{ color: '#2e7d32' }}>3. Return Process</h3>
      <p>To initiate a return:</p>

      <ol style={{ paddingLeft: '20px' }}>
        <li>
          Contact our customer support at{' '}
          <strong>support@cerealswale.com</strong> or call{' '}
          <strong>+91-2231430562</strong> within 5-7 days of receiving your
          order.
        </li>
        <li>
          Provide your <strong>Order ID</strong>, reason for return, and clear
          images of the product if damaged/defective.
        </li>
        <li>
          Our team will verify your request and guide you through the return
          pickup or shipping process.
        </li>
        <li>
          <strong>
            Please do not ship any product back without receiving a confirmation
            from our support team.
          </strong>
        </li>
      </ol>

      <h3 style={{ color: '#2e7d32' }}>4. Refund Process</h3>
      <p>Once your returned item is received and inspected:</p>

      <ul style={{ paddingLeft: '20px' }}>
        <li>
          Refunds will be processed within <strong>24-48 hours</strong> to your
          original payment method.
        </li>
        <li>
          In case of Cash on Delivery (COD) orders, refunds will be issued via
          bank transfer or UPI after verification.
        </li>
        <li>
          Shipping charges if any are non-refundable, except in cases where the
          product is defective or wrongly delivered.
        </li>
      </ul>

      <h3 style={{ color: '#2e7d32' }}>5. Replacement Policy</h3>
      <p>
        If your product is found defective or damaged, we may offer a replacement
        instead of a refund, depending on product availability. If a replacement
        is not available, a full refund will be issued.
      </p>

      <h3 style={{ color: '#2e7d32' }}>6. Order Cancellation</h3>

      <ul style={{ paddingLeft: '20px' }}>
        <li>
          Orders can be cancelled <strong>before dispatch</strong> by contacting
          our customer service team.
        </li>
        <li>
          Once shipped, orders cannot be cancelled and must follow the standard
          return process.
        </li>
      </ul>

      <h3 style={{ color: '#2e7d32' }}>7. Contact Us</h3>
      <p>
        For any questions, return requests, or refund-related assistance, please
        contact:
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
          <strong>Brand:</strong> Cerealswale
          <br />
          <strong>Website:</strong>{' '}
          <a href="https://www.cerealswale.com/" style={{ color: '#2e7d32' }}>
            www.cerealswale.com
          </a>
          <br />
          <strong>Email:</strong> support@cerealswale.com
          <br />
          <strong>Phone:</strong> +91-2231430562
          <br />
          <strong>Address:</strong> Office No 505, Juhi Niharika Mirage,
          Kharghar Sector 10, District Raigarh, Navi Mumbai, Maharashtra -
          410210
          <br />
          <strong>Corporate Identity Number:</strong> U62099MH2024PTC418993
          <br />
          <strong>GSTN:</strong> 27AALCC6380M1Z1
        </p>
      </div>

      <hr />

      <h3 style={{ color: '#2e7d32' }}>8. Policy Updates</h3>
      <p style={{ fontSize: '12px', color: '#888' }}>
        <strong>CATALYST SERVICE PRIVATE LIMITED</strong> reserves the right to
        modify or update this Return & Refund Policy at any time. All changes
        will be reflected on this page. We encourage you to check this page
        periodically for the latest information.
      </p>
    </div>
  );
}
