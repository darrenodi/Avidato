import React from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export default function PrivacyPolicyPage() {
  return (
    <>
      <PublicNavbar />
      <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
  <p className="mb-4">This Privacy Policy describes how Avidato LLC (&quot;Avidato&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), a company registered in New Mexico, United States, collects, uses, discloses, and protects your information when you use our services. By accessing or using Avidato, you consent to the practices described in this policy.</p>


      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="mb-4">We may collect the following types of information:</p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Personal Information:</strong>
          <ul className="list-decimal ml-6">
            <li>Name, email address, and contact details</li>
            <li>Account credentials (username, password)</li>
            <li>Profile information you provide</li>
            <li>Payment and billing information (if applicable)</li>
          </ul>
        </li>
        <li><strong>Usage Data:</strong>
          <ul className="list-decimal ml-6">
            <li>IP address and device identifiers</li>
            <li>Browser type, operating system, and device information</li>
            <li>Pages visited, features used, and actions taken within the service</li>
            <li>Referring URLs and exit pages</li>
            <li>Date and time of access</li>
          </ul>
        </li>
        <li><strong>Cookies and Tracking Technologies:</strong>
          <ul className="list-decimal ml-6">
            <li>Session cookies for authentication and security</li>
            <li>Preference cookies to remember your settings</li>
            <li>Analytics cookies to understand usage patterns</li>
            <li>Third-party cookies for integrations and social media</li>
          </ul>
        </li>
        <li><strong>Communications:</strong>
          <ul className="list-decimal ml-6">
            <li>Support requests and correspondence</li>
            <li>Feedback, survey responses, and testimonials</li>
          </ul>
        </li>
        <li><strong>Other Information:</strong>
          <ul className="list-decimal ml-6">
            <li>Information you voluntarily provide through forms or interactive features</li>
            <li>Information from third-party sources, such as integrations or partners, where permitted by law</li>
          </ul>
        </li>
      </ul>


      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <p className="mb-4">We may use your information for the following purposes:</p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Service Delivery:</strong>
          <ul className="list-decimal ml-6">
            <li>To create and manage your account</li>
            <li>To provide, operate, and maintain our services</li>
            <li>To process transactions and send related information</li>
          </ul>
        </li>
        <li><strong>Personalization:</strong>
          <ul className="list-decimal ml-6">
            <li>To tailor content and features to your preferences</li>
            <li>To remember your settings and preferences</li>
          </ul>
        </li>
        <li><strong>Communication:</strong>
          <ul className="list-decimal ml-6">
            <li>To send administrative messages, updates, and security alerts</li>
            <li>To respond to your inquiries and provide support</li>
            <li>To send marketing and promotional communications (with your consent, where required by law)</li>
          </ul>
        </li>
        <li><strong>Analytics and Improvement:</strong>
          <ul className="list-decimal ml-6">
            <li>To monitor and analyze usage, trends, and activities</li>
            <li>To improve and develop new features and services</li>
          </ul>
        </li>
        <li><strong>Security and Compliance:</strong>
          <ul className="list-decimal ml-6">
            <li>To detect, prevent, and address technical issues and security risks</li>
            <li>To comply with legal obligations and enforce our terms and policies</li>
          </ul>
        </li>
      </ul>


      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Sharing and Disclosure</h2>
      <p className="mb-4">We do not sell your personal information. We may share your information as follows:</p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>With Service Providers:</strong>
          <ul className="list-decimal ml-6">
            <li>Cloud hosting, analytics, payment processing, and customer support providers</li>
            <li>Contractors and consultants who assist in service delivery</li>
          </ul>
        </li>
        <li><strong>For Legal and Safety Reasons:</strong>
          <ul className="list-decimal ml-6">
            <li>To comply with legal obligations, court orders, or government requests</li>
            <li>To protect the rights, property, or safety of Avidato, our users, or others</li>
            <li>To detect and prevent fraud, abuse, or security threats</li>
          </ul>
        </li>
        <li><strong>Business Transfers:</strong>
          <ul className="list-decimal ml-6">
            <li>In connection with a merger, acquisition, reorganization, or sale of assets</li>
            <li>You will be notified of any changes in ownership or use of your information</li>
          </ul>
        </li>
        <li><strong>With Your Consent:</strong>
          <ul className="list-decimal ml-6">
            <li>We may share information with third parties when you give us explicit permission</li>
          </ul>
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
      <p className="mb-4">We implement reasonable administrative, technical, and physical safeguards to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Retention</h2>
      <p className="mb-4">We retain your personal information for as long as necessary to fulfill the purposes described in this policy, comply with our legal obligations, resolve disputes, and enforce our agreements.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Cookie Policy</h2>
      <p className="mb-4">We use cookies and similar tracking technologies to enhance your experience and understand how you use our service. You can manage your cookie preferences through the cookie consent banner displayed on our site.</p>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">Types of Cookies We Use:</h3>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Necessary Cookies (Always Enabled):</strong>
          <ul className="list-decimal ml-6">
            <li><strong>Session Token:</strong> Maintains your authentication session. Essential for logging in and staying logged in. HttpOnly, Secure, expires after 30 days.</li>
            <li><strong>CSRF Token:</strong> Protects against Cross-Site Request Forgery attacks. Essential for security when submitting forms. HttpOnly, Secure.</li>
            <li><strong>Callback URL:</strong> Stores your intended destination after login for proper redirect. HttpOnly, Secure.</li>
          </ul>
        </li>
        <li><strong>Analytics Cookies (Opt-In):</strong>
          <ul className="list-decimal ml-6">
            <li>Tracks anonymous page views and user interactions to help us understand how you use our service</li>
            <li>Only enabled if you click &quot;Mmm... Sweet!&quot; on the cookie consent banner</li>
            <li>Expires after 24 hours</li>
            <li>No personal information is stored in analytics cookies</li>
          </ul>
        </li>
        <li><strong>Preference Cookies (Optional):</strong>
          <ul className="list-decimal ml-6">
            <li>Remember your settings such as theme preference, language selection, and other customizations</li>
            <li>Accessible to JavaScript for client-side functionality</li>
            <li>Expires after 1 year</li>
          </ul>
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">Cookie Consent Management:</h3>
      <p className="mb-4">When you first visit Avidato, you will see a cookie consent banner with two options:</p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>&quot;Mmm... Sweet!&quot;</strong> - Accepts all cookies including analytics tracking</li>
        <li><strong>&quot;Nope... I am on a diet 😊&quot;</strong> - Disables analytics cookies while keeping necessary cookies for authentication and security</li>
      </ul>
      <p className="mb-4">Your preference is saved for 1 year. You can change your cookie preferences at any time by clearing your browser cookies and refreshing the page.</p>

      <h3 className="text-lg font-semibold mt-4 mb-2">Cookie Security:</h3>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>HttpOnly Flag:</strong> Authentication cookies cannot be accessed by JavaScript, protecting against XSS (Cross-Site Scripting) attacks</li>
        <li><strong>Secure Flag:</strong> Cookies are only transmitted over HTTPS connections in production</li>
        <li><strong>SameSite Attribute:</strong> Prevents cookies from being sent in cross-site requests, protecting against CSRF attacks</li>
        <li><strong>Encryption:</strong> Session tokens are encrypted JWT tokens validated on every request</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">Your Cookie Rights:</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>You can accept or reject analytics cookies at any time using our consent banner</li>
        <li>You can delete cookies from your browser settings at any time</li>
        <li>You can configure your browser to refuse cookies (though this may limit functionality)</li>
        <li>Refusing cookies will not prevent necessary authentication cookies from being used</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Your Rights and Choices</h2>
      <p className="mb-4">Depending on your location, you may have the right to access, correct, update, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us at support@avidato.com.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Children&apos;s Privacy</h2>
      <p className="mb-4">Avidato is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will take steps to delete such information.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. International Data Transfers</h2>
      <p className="mb-4">Your information may be transferred to and processed in countries other than your own. By using our services, you consent to the transfer of your information to the United States and other jurisdictions as necessary.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">10. Changes to This Privacy Policy</h2>
      <p className="mb-4">We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the effective date. Your continued use of the service after such changes constitutes your acceptance of the new policy.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">11. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy or our data practices, please contact us at support@avidato.com or by mail at Avidato LLC, 123 Main Street, Albuquerque, NM 87101, USA.</p>
      </main>
      <PublicFooter />
    </>
  );
}
