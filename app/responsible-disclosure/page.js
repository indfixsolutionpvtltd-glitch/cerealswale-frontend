import React from 'react';

export default function ResponsibleDisclosure() {
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
        Responsible Disclosure
      </h1>

      <p>
        <strong>CATALYST SERVICE PRIVATE LIMITED</strong> is committed to
        protecting its customers' data and privacy. We also recognize the
        important role that security researchers play in helping us keep our
        systems secure. We therefore invite security researchers to responsibly
        disclose potential security vulnerabilities in our systems.
      </p>

      <p>
        If you believe you have found a security vulnerability in the{' '}
        <strong>CATALYST SERVICE PRIVATE LIMITED</strong> systems, please
        contact us at <strong>support@cerealswale.com</strong>. We will
        investigate any reported vulnerability and take appropriate steps to
        address the issue. We are committed to working with security researchers
        to ensure any vulnerability is properly resolved. Thank you in advance
        for your help in keeping our customers' data and privacy secure.
      </p>

      <hr />

      <h3 style={{ color: '#2e7d32' }}>Reporting Guidelines</h3>
      <p>Please provide the following details in your report:</p>

      <ol style={{ paddingLeft: '20px' }}>
        <li>Description and potential impact of the vulnerability;</li>
        <li>
          A detailed description of the steps required to reproduce the
          vulnerability; and,
        </li>
        <li>Where available, a video Proof of Concept (POC).</li>
        <li>
          Email your report to <strong>support@cerealswale.com</strong>.
        </li>
      </ol>

      <p>
        <strong>Note:</strong> Only vulnerabilities deemed exploitable will be
        considered for a reward. The determination of exploitability and the
        acceptance of reported vulnerabilities lie solely at the discretion of
        the <strong>CATALYST SERVICE PRIVATE LIMITED</strong> Security Team.
      </p>

      <hr />

      <h3 style={{ color: '#2e7d32' }}>Policy</h3>
      <p>We ask that:</p>

      <ol style={{ paddingLeft: '20px' }}>
        <li>
          Security researchers must not violate the privacy of our customers or
          disrupt the availability of our services.
        </li>
        <li>
          Security researchers must conduct their activities in compliance with
          all applicable laws.
        </li>
        <li>
          Security researchers are encouraged to disclose potential security
          vulnerabilities in a responsible manner and provide sufficient details
          to allow <strong>CATALYST SERVICE PRIVATE LIMITED</strong> to
          reproduce and resolve the issue.
        </li>
        <li>
          Security researchers must not publicly disclose any potential security
          vulnerabilities until{' '}
          <strong>CATALYST SERVICE PRIVATE LIMITED</strong> has been given a
          reasonable amount of time to respond and remediate the issue.
        </li>
        <li>
          Security researchers must not access or use any{' '}
          <strong>CATALYST SERVICE PRIVATE LIMITED</strong> customer data without
          permission.
        </li>
        <li>
          Security researchers should not attempt to exploit a vulnerability or
          access any company systems without permission.
        </li>
        <li>
          Security researchers should not attempt to reverse engineer any company
          code or systems without permission.
        </li>
        <li>Security researchers must not modify any data.</li>
        <li>
          Issues identified via the Nuclei tool are already known to us; please
          do not report issues found using Nuclei tools.
        </li>
        <li>
          Only high-severity exploitable issues are eligible for the Hall of
          Fame.
        </li>
      </ol>
    </div>
  );
}
