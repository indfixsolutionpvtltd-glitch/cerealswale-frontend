import React from 'react';

export default function ResponsibleDisclosure() {
  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', lineHeight: '1.6' }}>
      <h1>Responsible Disclosure</h1>
      <p>We recognize the important role that security researchers play. If you find a vulnerability, please report it to <strong>support@cerealswale.com</strong>.</p>
      <h3>Reporting Guidelines</h3>
      <ol>
        <li>Description and potential impact.</li>
        <li>Steps to reproduce.</li>
        <li>Video POC (if available).</li>
      </ol>
      <p>Only high-severity exploitable issues are eligible for the Hall of Fame.</p>
    </div>
  );
}
