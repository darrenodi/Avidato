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

        <h2 className="text-xl font-semibold mt-6 mb-2">30-Day Money-Back Guarantee</h2>
        <p className="mb-4">
          At Avidato (&quot;Avidato&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we stand behind our service. If you are not satisfied with Avidato for any reason, you may request a full refund within 30 days of your initial purchase. No questions asked.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">How to Request a Refund</h2>
        <p className="mb-4">To request a refund, please follow these steps:</p>
        <ol className="list-decimal ml-6 mb-4 space-y-2">
          <li><strong>Contact Support:</strong> Email us at support@avidato.com with the subject line &quot;Refund Request&quot;</li>
          <li><strong>Provide Details:</strong> Include your account email address and the transaction ID or invoice number</li>
          <li><strong>Processing:</strong> We will process your refund to your original payment method within 5-10 business days</li>
        </ol>

        <h2 className="text-xl font-semibold mt-6 mb-2">Refunds After 30 Days</h2>
        <p className="mb-4">
          If you request a refund after 30 days from your initial purchase, refunds are at our sole discretion. Please contact our support team at support@avidato.com to discuss your situation.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Subscription Cancellation</h2>
        <p className="mb-4">
          You may cancel your subscription at any time through your account settings. Cancellations take effect at the end of your current billing period. To receive a refund, please cancel and submit a refund request within 30 days of your initial purchase.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Trial Periods</h2>
        <p className="mb-4">
          If we offer a free trial, you must cancel before the trial ends to avoid being charged for a subscription. Failure to cancel will result in automatic subscription enrollment and charges to your payment method.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Promotional Codes and Credits</h2>
        <p className="mb-4">
          Promotional codes, gift cards, and free trial credits are non-refundable and cannot be converted to cash. These can only be used for services within Avidato.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Billing Errors and Disputes</h2>
        <p className="mb-4">
          If you believe you have been incorrectly charged or if there is a billing error, please contact our support team at support@avidato.com immediately. We will investigate and resolve the issue promptly.
        </p>
        <p className="mb-4">
          If you file a chargeback or dispute with your credit card company or bank without first contacting us, your account may be suspended and you may lose eligibility for refunds under this policy.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Special Circumstances</h2>
        <p className="mb-4">
          In cases of service outages, data loss, or significant technical issues caused by Avidato, we may issue credits or refunds at our sole discretion. We will communicate any such decisions through your registered email address.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Changes to This Policy</h2>
        <p className="mb-4">
          We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting to this page. Your continued use of Avidato after changes constitutes your acceptance of the new policy.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p className="mb-4">
          If you have questions about this Refund Policy or wish to request a refund, please contact us at:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li><strong>Email:</strong> support@avidato.com</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Your Legal Rights</h2>
        <p className="mb-4">
          This Refund Policy is provided in addition to any consumer protection rights you may have under applicable law. Nothing in this policy limits your legal rights as a consumer. If you are located in the European Union or other jurisdictions with consumer protection laws, those laws may provide you with additional rights.
        </p>
      </main>
      <PublicFooter />
    </>
  );
}
