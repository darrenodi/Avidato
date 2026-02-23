'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { initializePaddle, type Paddle } from '@paddle/paddle-js';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import CheckCircleIcon from '@/components/icons/CheckCircleIcon';

interface PricingPlan {
  title: string;
  price: {
    monthly: number;
    annual: number;
  };
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  priceIds?: {
    monthly: string;
    annual: string;
  };
}

const pricingPlans: PricingPlan[] = [
  {
    title: 'Starter',
    description: 'Perfect for trying things out.',
    price: { monthly: 0, annual: 0 },
    buttonText: 'Get Started',
    features: [
      '20 generations / day',
      'Unlimited students',
      'Shareable lesson links',
      'Basic email support',
      'Access to 3 teaching methodologies',
    ],
  },
  {
    title: 'Pro',
    description: 'For the dedicated professional tutor.',
    price: { monthly: 6, annual: 5 },
    buttonText: 'Upgrade to Pro',
    isPopular: true,
    priceIds: {
      monthly: process.env.NEXT_PUBLIC_PRO_MONTHLY_PLAN_ID!,
      annual: process.env.NEXT_PUBLIC_PRO_YEARLY_PLAN_ID!,
    },
    features: [
      'Everything in Starter, plus:',
      'Unlimited lesson plans',
      'Priority email support',
      'Advanced customization',
      'Lesson history & analytics',
      'Export to multiple formats',
      'Ad-free experience',
    ],
  },
  {
    title: 'Premium',
    description: 'For small teams and power users.',
    price: { monthly: 10, annual: 8 },
    buttonText: 'Choose Premium',
    priceIds: {
      monthly: process.env.NEXT_PUBLIC_PREMIUM_MONTHLY_PLAN_ID!,
      annual: process.env.NEXT_PUBLIC_PREMIUM_YEARLY_PLAN_ID!,
    },
    features: [
      'Everything in Pro, plus:',
      'Team access (up to 3 tutors)',
      'Custom branding on shared links',
      'Dedicated support channel',
      'Usage analytics & reports',
      'Bulk student imports',
      'API access',
    ],
  },
];

const faqData = [
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and can also process payments through PayPal and other digital payment methods.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: "Yes! You can cancel your subscription anytime. No questions asked. If you cancel mid-billing cycle, you'll have access until the end of your paid period.",
  },
  {
    question: 'Is there a difference between monthly and annual billing?',
    answer: 'When you pay annually, you save approximately 20% compared to monthly billing. Annual plans renew automatically every 12 months.',
  },
  {
    question: 'Do I need a credit card for the Starter plan?',
    answer: 'No credit card required! The Starter plan is completely free. You only need to provide a credit card if you decide to upgrade to Pro or Premium.',
  },
  {
    question: 'Can I upgrade or downgrade my plan anytime?',
    answer: "Absolutely! You can change your plan at any time. If you upgrade, you&apos;ll be charged the prorated difference. If you downgrade, you&apos;ll receive a credit toward your next billing cycle.",
  },
  {
    question: 'What if I need more than 3 tutors on the Premium plan?',
    answer: 'We offer custom enterprise plans for larger teams. Contact our sales team at sales@avidato.com to discuss your specific needs.',
  },
];

export default function PricingPage() {
  const [pricingTier, setPricingTier] = useState<'monthly' | 'annual'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number>(1);
  const { data: session, status } = useSession();
  const user = session?.user as { id?: string; email?: string | null } | undefined;
  const [paddleInstance, setPaddleInstance] = useState<Paddle | null>(null);

  // Initialize Paddle.js
  useEffect(() => {
    const clientToken =
      process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'sandbox'
        ? process.env.NEXT_PUBLIC_PADDLE_SANDBOX_CLIENT!
        : process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!;

    if (!clientToken) return;

    initializePaddle({
      token: clientToken,
      environment: (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as 'sandbox' | 'production') ?? 'sandbox',
      eventCallback: (event) => {
        if (event.name === 'checkout.completed') {
          // Redirect to dashboard after successful checkout
          window.location.href = '/dashboard?upgraded=true';
        }
      },
    }).then((paddle) => {
      if (paddle) setPaddleInstance(paddle);
    });
  }, []);

  const openCheckout = useCallback(
    (plan: PricingPlan) => {
      if (!plan.priceIds) {
        // Free plan → signup
        window.location.href = '/signup';
        return;
      }

      if (status !== 'authenticated' || !user?.id) {
        // Not logged in → signup first, then they can upgrade
        window.location.href = '/signup';
        return;
      }

      if (!paddleInstance) {
        console.error('Paddle not initialized');
        return;
      }

      const priceId = pricingTier === 'monthly' ? plan.priceIds.monthly : plan.priceIds.annual;

      paddleInstance.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: user.email ? { email: user.email } : undefined,
        customData: {
          userId: user.id,
        },
        settings: {
          theme: 'light',
          displayMode: 'overlay',
          successUrl: `${window.location.origin}/dashboard?upgraded=true`,
        },
      });
    },
    [paddleInstance, pricingTier, user, status]
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicNavbar />

      <main className="flex-grow">
        {/* === HERO SECTION === */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              No credit card required. Cancel anytime.
            </p>
            <p className="text-gray-500 text-sm mb-8">Choose the plan that works best for you</p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-12">
              <button
                onClick={() => setPricingTier('monthly')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  pricingTier === 'monthly'
                    ? 'bg-white text-brand-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPricingTier('annual')}
                className={`px-6 py-2 rounded-full font-medium transition-all relative ${
                  pricingTier === 'annual'
                    ? 'bg-white text-brand-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                {pricingTier === 'annual' && (
                  <span className="absolute -top-3 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* === PRICING CARDS === */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredCardIndex(index)}
                  onMouseLeave={() => setHoveredCardIndex(1)}
                  className={`relative rounded-2xl transition-all duration-300 ${
                    plan.isPopular
                      ? 'ring-2 ring-brand-primary md:scale-105 shadow-2xl'
                      : hoveredCardIndex === index
                      ? 'shadow-lg'
                      : 'shadow-md'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}

                  <div className={`p-8 rounded-2xl h-full flex flex-col ${
                    plan.isPopular ? 'bg-white' : 'bg-white'
                  }`}>
                    {/* Plan Header */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                    <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-gray-900">
                          ${pricingTier === 'monthly' ? plan.price.monthly : plan.price.annual}
                        </span>
                        <span className="text-gray-600 ml-2">/month</span>
                      </div>
                      {pricingTier === 'annual' && (
                        <p className="text-sm text-gray-500 mt-2">
                          Billed ${plan.price.annual * 12} annually
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    {plan.priceIds ? (
                      <button
                        onClick={() => openCheckout(plan)}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors mb-8 text-center ${
                          plan.isPopular
                            ? 'bg-brand-primary text-white hover:bg-brand-accent'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {plan.buttonText}
                      </button>
                    ) : (
                      <Link
                        href="/signup"
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors mb-8 text-center block ${
                          plan.isPopular
                            ? 'bg-brand-primary text-white hover:bg-brand-accent'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {plan.buttonText}
                      </Link>
                    )}

                    {/* Features List */}
                    <div className="space-y-4 flex-grow">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start">
                          {!feature.includes('<') ? (
                            <>
                              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </>
                          ) : (
                            <span
                              className="text-gray-900 text-sm font-semibold"
                              dangerouslySetInnerHTML={{ __html: feature }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === COMPARISON TABLE === */}
        <section className="px-4 py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Feature Comparison
            </h2>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-900">Starter</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-900">Pro</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-900">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">Lesson Generations</td>
                    <td className="px-6 py-4 text-center text-gray-600">20/day</td>
                    <td className="px-6 py-4 text-center text-gray-600">Unlimited</td>
                    <td className="px-6 py-4 text-center text-gray-600">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">Students</td>
                    <td className="px-6 py-4 text-center text-gray-600">Unlimited</td>
                    <td className="px-6 py-4 text-center text-gray-600">Unlimited</td>
                    <td className="px-6 py-4 text-center text-gray-600">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">Team Access</td>
                    <td className="px-6 py-4 text-center text-gray-600">Solo</td>
                    <td className="px-6 py-4 text-center text-gray-600">Solo</td>
                    <td className="px-6 py-4 text-center text-gray-600">Up to 3</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">Custom Branding</td>
                    <td className="px-6 py-4 text-center">—</td>
                    <td className="px-6 py-4 text-center">—</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">API Access</td>
                    <td className="px-6 py-4 text-center">—</td>
                    <td className="px-6 py-4 text-center">—</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">Support</td>
                    <td className="px-6 py-4 text-center text-gray-600">Basic</td>
                    <td className="px-6 py-4 text-center text-gray-600">Priority</td>
                    <td className="px-6 py-4 text-center text-gray-600">Dedicated</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">Analytics</td>
                    <td className="px-6 py-4 text-center">—</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* === FAQ SECTION === */}
        <section className="px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
              Your questions, answered
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Have a question? We&apos;re here to help. Check out our most frequently asked questions below.
            </p>

            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex justify-between items-center"
                  >
                    {faq.question}
                    <span className={`text-brand-primary transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}>
                      ▼
                    </span>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === CTA SECTION === */}
        <section className="px-4 py-20 bg-gradient-to-r from-brand-primary to-brand-accent">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to transform your teaching?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Join thousands of educators who are saving hours every week with Avidato.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-brand-primary bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              Get Started for Free
            </Link>
            <p className="text-blue-100 text-sm mt-4">No credit card required. Cancel anytime.</p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
