import React from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export default function RefundPolicyPage() {
  return (
    <>
      <PublicNavbar />
      <main className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
        <p className="mb-4">
          Last Updated: November 2025
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Overview</h2>
        <p className="mb-4">
          At Avidato LLC (&quot;Avidato&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we are committed to providing quality services. This Refund Policy outlines the circumstances under which refunds are available and the process for requesting one.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Refund Eligibility</h2>
        <p className="mb-4">You may be eligible for a refund in the following circumstances:</p>
        <ul className="list-disc ml-6 mb-4">
          <li><strong>Service Not Received:</strong> You paid for a service or feature that was not delivered or was unavailable due to our technical failure (not due to your actions or internet connectivity issues)</li>
          <li><strong>Billing Error:</strong> You were incorrectly charged, double-charged, or charged for a service you did not authorize</li>
          <li><strong>Unresolved Service Issues:</strong> You experienced a significant service defect or outage that prevented you from using the service for more than 7 consecutive days, and our support team was unable to resolve the issue despite your good-faith efforts to work with us</li>
          <li><strong>Account Cancellation (First Month):</strong> For annual or multi-month subscriptions, you may request a refund within 7 days of your initial purchase if you decide the service is not right for you</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Refunds NOT Available</h2>
        <p className="mb-4">Refunds are not available for:</p>
        <ul className="list-disc ml-6 mb-4">
          <li><strong>Change of Mind:</strong> You changed your mind about your purchase after the first 7 days of a subscription</li>
          <li><strong>User Error:</strong> Issues caused by your misuse of the service, failure to follow instructions, or incompatible systems</li>
          <li><strong>Third-Party Services:</strong> Charges from third-party payment processors or banks (contact your payment provider)</li>
          <li><strong>Custom Work:</strong> Non-refundable custom lessons, worksheets, or content generated at your request</li>
          <li><strong>Promotional Credits:</strong> Promotional codes, gift cards, or free trial credits cannot be refunded or converted to cash</li>
          <li><strong>Partial Usage:</strong> Monthly or recurring subscriptions used for any portion of the billing cycle (unless within the 7-day initial purchase window)</li>
          <li><strong>Voluntary Account Deletion:</strong> If you delete your account after using services</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. How to Request a Refund</h2>
        <p className="mb-4">To request a refund, please follow these steps:</p>
        <ol className="list-decimal ml-6 mb-4 space-y-2">
          <li><strong>Contact Support:</strong> Email us at support@avidato.com with the subject line &quot;Refund Request&quot;</li>
          <li><strong>Provide Details:</strong> Include:
            <ul className="list-disc ml-6 mt-2">
              <li>Your account email address</li>
              <li>The transaction ID or invoice number</li>
              <li>The date of purchase</li>
              <li>A detailed explanation of why you are requesting a refund</li>
              <li>Any relevant screenshots or documentation of the issue</li>
            </ul>
          </li>
          <li><strong>Allow Processing Time:</strong> We will review your request within 5-7 business days</li>
          <li><strong>Receive Decision:</strong> We will respond with an approval, denial, or request for additional information</li>
        </ol>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Refund Process & Timeline</h2>
        <ul className="list-disc ml-6 mb-4">
          <li><strong>Approval:</strong> Refund requests are typically approved within 5-7 business days</li>
          <li><strong>Processing:</strong> Once approved, refunds are processed to the original payment method</li>
          <li><strong>Timeline:</strong> Refunds typically appear in your account within 5-10 business days after approval, depending on your bank or payment provider</li>
          <li><strong>Credit Card Disputes:</strong> If you file a chargeback or dispute with your credit card company without contacting us first, we may not be able to assist you further</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Dispute Resolution</h2>
        <p className="mb-4">If you disagree with our refund decision, you may:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Request a review within 14 days of our decision by emailing support@avidato.com with additional information</li>
          <li>We will consider your appeal and respond within 5 business days</li>
          <li>Our decision on the appeal is final</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Chargeback & Payment Disputes</h2>
        <p className="mb-4">
          If you file a chargeback, payment dispute, or claim with your bank or credit card company without first contacting us through our support team:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Your account may be suspended or terminated</li>
          <li>You may forfeit your right to a refund through this policy</li>
          <li>We reserve the right to pursue recovery of associated fees and legal costs</li>
        </ul>
        <p className="mb-4">
          Please contact us first at support@avidato.com to resolve billing issues before disputing with your payment provider.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Subscription Cancellation</h2>
        <p className="mb-4">
          You may cancel your subscription at any time through your account settings. Cancellations take effect at the end of your current billing period. No refund is provided for the current billing period once a subscription is active, unless eligible under Section 1 (Account Cancellation - First Month).
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">8. Trial Periods</h2>
        <p className="mb-4">
          If we offer a free trial, you must cancel before the trial ends to avoid being charged. Failure to cancel results in automatic subscription enrollment. Free trial periods cannot be extended or reused for the same account.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">9. Special Circumstances</h2>
        <p className="mb-4">
          In cases of service outages, data loss, or significant security incidents caused by Avidato, we may issue credits or refunds at our sole discretion. We will communicate any such decisions through your registered email address.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">10. Changes to This Policy</h2>
        <p className="mb-4">
          We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting to this page. Your continued use of Avidato after changes constitutes your acceptance of the new policy. We encourage you to review this policy periodically.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">11. Contact Us</h2>
        <p className="mb-4">
          If you have questions about this Refund Policy or wish to request a refund, please contact us at:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li><strong>Email:</strong> support@avidato.com</li>
          <li><strong>Mailing Address:</strong> Avidato LLC, 123 Main Street, Albuquerque, NM 87101, USA</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">12. Legal Rights</h2>
        <p className="mb-4">
          This Refund Policy is provided in addition to any consumer protection rights you may have under applicable law. Nothing in this policy limits your legal rights as a consumer. If you are located in the European Union or other jurisdictions with consumer protection laws, those laws may provide you with additional rights that cannot be waived by this policy.
        </p>
      </main>
      <PublicFooter />
    </>
  );
}
