import React from "react";

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Refund & Cancellation Policy</h1>
      <div className="prose prose-lg">
        <p className="mb-4">
          At Metaverse, we strive to ensure our customers are satisfied with every transaction. Please read our Refund & Cancellation Policy carefully to understand your rights and obligations regarding refunds.
        </p>
        
        <h2 className="text-2xl font-bold mt-6 mb-4">1. Order Cancellation</h2>
        <p className="mb-2">
          Once a transaction is completed, you are entering into a legally binding agreement with us. Cancellations are only permitted if explicitly mentioned on the product or service page.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>If cancellations are allowed, the terms will be specified on the platform.</li>
          <li>We reserve the right to approve or reject any cancellation request at our sole discretion.</li>
          <li>Additional details may be requested before processing a cancellation.</li>
        </ul>
        
        <h2 className="text-2xl font-bold mt-6 mb-4">2. Refund Eligibility</h2>
        <p className="mb-2">
          Refunds are applicable only under the following condition:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>If the product or service received does not match the description provided on the platform.</li>
        </ul>
        <p className="mb-4">
          Refunds will not be issued for reasons including but not limited to change of mind, personal preference, or lack of usage unless specified otherwise in the product/service terms.
        </p>
        
        <h2 className="text-2xl font-bold mt-6 mb-4">3. Refund Request Timeline</h2>
        <p className="mb-4">
          All refund requests must be submitted within 5 days from the date of the transaction. Requests submitted after this period will not be eligible for review.
        </p>
        
        <h2 className="text-2xl font-bold mt-6 mb-4">4. How to Request a Refund</h2>
        <p className="mb-2">
          To initiate a refund, please email us at
        </p>
        <p className="mb-4 font-medium">
          📧 ashishrai6387@gmail.com
        </p>
        <p className="mb-2">
          with the following details:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Order ID</li>
          <li>Date of Transaction</li>
          <li>Reason for Refund (with reference to terms violated)</li>
          <li>Supporting evidence (if applicable)</li>
        </ul>
        <p className="mb-4">
          Alternatively, you may raise a support ticket through your account dashboard.
        </p>
        
        <h2 className="text-2xl font-bold mt-6 mb-4">5. Refund Processing Timeline</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Upon receiving your request, we will acknowledge it within 24–48 hours.</li>
          <li>Our team will investigate and respond with a decision within 3–5 business days.</li>
          <li>Once approved, refunds will be initiated and credited to your original payment source within 7–10 business days, depending on your payment provider or bank.</li>
        </ul>
        
        <h2 className="text-2xl font-bold mt-6 mb-4">6. Contact & Support</h2>
        <p className="mb-4">
          If you have any questions about your refund or this policy, please reach out to us at ashishrai6387@gmail.com.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy; 