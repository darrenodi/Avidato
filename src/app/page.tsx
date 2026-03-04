// src/app/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';

import ArrowForwardIcon from '@/components/icons/ArrowForwardIcon';
import CheckCircleIcon from '@/components/icons/CheckCircleIcon';
import AddIcon from '@/components/icons/AddIcon';
import AutoAwesomeIcon from '@/components/icons/AutoAwesomeIcon';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const testimonials = [
  {
    quote: "I used to spend 45 minutes prepping each lesson. Now it takes me five. I just tweak and go.",
    name: 'Maria L.',
    role: 'Online ESL Tutor, Spain',
  },
  {
    quote: "The YouTube-to-lesson feature is a game changer. My students love discussing real videos.",
    name: 'James K.',
    role: 'IELTS Prep Teacher, UK',
  },
  {
    quote: "Sharing lesson links with students without them needing to sign up is such a huge plus.",
    name: 'Yuki T.',
    role: 'Private English Tutor, Japan',
  },
  {
    quote: "Finally a tool that actually understands how language teachers plan. Not just generic AI output.",
    name: 'Daniel R.',
    role: 'Business English Coach, Germany',
  },
  {
    quote: "I run 30+ lessons a week. Avidato keeps everything organized per student. Total lifesaver.",
    name: 'Sofia M.',
    role: 'Freelance Teacher, Brazil',
  },
];

const pricingPlans = [
  {
    title: 'Starter',
    subtitle: 'Perfect for trying things out.',
    price: 0,
    cta: 'Get started',
    features: ['20 generations / day', 'Unlimited students', 'Shareable lesson links'],
  },
  {
    title: 'Pro',
    subtitle: 'For the dedicated professional.',
    price: 6,
    cta: 'Upgrade to Pro',
    popular: true,
    features: ['Everything in Starter, plus:', 'Unlimited lesson plans', 'Priority email support'],
  },
  {
    title: 'Premium',
    subtitle: 'For small teams and power users.',
    price: 10,
    cta: 'Choose Premium',
    features: ['Everything in Pro, plus:', 'Team access (up to 3 tutors)', 'Custom branding on shared links'],
  },
];

const faqData = [
  { id: 'faq1', question: 'Is this just another AI content generator?', answer: "No. Avidato is purpose-built for ESL teachers. Instead of generic text, you get structured lesson plans with warm-ups, vocabulary, activities, and discussion, all tailored to a specific student's CEFR level." },
  { id: 'faq2', question: 'Will the AI-generated lessons actually be good?', answer: 'Yes. The AI structures lessons using proven teaching frameworks. We encourage you to use the generated plans as a strong first draft you can quickly adapt, saving you 90% of the prep time.' },
  { id: 'faq3', question: "I'm not tech-savvy. Is this complicated?", answer: 'Not at all. The whole process, from adding a student to generating a lesson, takes a few clicks. If you can use email, you can use Avidato.' },
  { id: 'faq4', question: 'Can I customize the plans?', answer: 'Full control. The AI gives you a comprehensive template. You can edit any section, add your own activities, or rearrange the order before your class.' },
  { id: 'faq5', question: 'What happens when I hit my daily limit?', answer: "You'll see a message letting you know. Your limit resets at midnight. To generate unlimited lessons, upgrade to Pro." },
  { id: 'faq6', question: 'Do my students need an account?', answer: "No, and that's a huge benefit. Shared lessons create a unique public link. Your student opens it on any device without logging in." },
];

/* ------------------------------------------------------------------ */
/*  Pill label component                                               */
/* ------------------------------------------------------------------ */

function SectionPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-4 py-1.5 mb-4">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */

const ease = [0.25, 0.4, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease },
  }),
};

const floatIn = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.25 + i * 0.12, duration: 0.65, ease },
  }),
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | false>('faq1');

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Avidato",
            "url": "https://avidato.com",
            "logo": { "@type": "ImageObject", "url": "https://avidato.com/android-chrome-512x512.png", "width": 512, "height": 512 },
            "description": "AI-powered English teaching assistant for online ESL/EFL tutors",
            "sameAs": ["https://twitter.com/avidato", "https://linkedin.com/company/avidato", "https://www.facebook.com/p/Avidato-61583867944633/", "https://www.instagram.com/avidato.ai/"]
          })
        }}
      />
      <PublicNavbar />

      <main className="flex-grow">

        {/* ============================================================ */}
        {/*  HERO                                                        */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="container mx-auto px-4 relative z-10">
            {/* Center column */}
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="mb-7"
              >
                <Image
                  src="/android-chrome-192x192.png"
                  alt="Avidato"
                  width={52}
                  height={52}
                  priority
                  className="mx-auto drop-shadow-md rounded-xl"
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.55 }}
                className="text-[2.6rem] md:text-[3.75rem] font-extrabold tracking-tight text-gray-900 leading-[1.08]"
              >
                Plan, teach, and share
                <br />
                <span className="text-gray-400">all in one place</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.55 }}
                className="mt-5 text-base md:text-lg text-gray-500 max-w-md mx-auto"
              >
                Generate structured ESL lesson plans in minutes. Customize anything. Share with your students instantly.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.55 }}
                className="mt-8"
              >
                <Link
                  href="/signup"
                  className="inline-flex items-center px-7 py-3.5 text-base font-semibold text-white bg-brand-primary rounded-full hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/20"
                >
                  Get started free
                  <ArrowForwardIcon className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            </div>

            {/* Floating cards around the hero */}
            <div className="relative mt-16 md:mt-20 max-w-5xl mx-auto hidden md:block" style={{ height: 400 }}>
              {/* Left: Lesson card */}
              <motion.div
                custom={0} initial="hidden" animate="visible" variants={floatIn}
                className="absolute left-0 top-10 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 -rotate-6 hover:-rotate-3 transition-transform duration-500"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Lesson 3 / 10</p>
                <h3 className="text-sm font-bold mt-1 text-gray-900">Discussing Future Trips</h3>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400" /><span className="text-xs text-gray-600">Warm-up: Dream Vacation</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400" /><span className="text-xs text-gray-600">Vocabulary: Booking</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400" /><span className="text-xs text-gray-600">Grammar: Future Tense</span></div>
                  <div className="flex items-center gap-2 opacity-50"><span className="w-2 h-2 rounded-full bg-gray-300" /><span className="text-xs text-gray-400">Activity: Airport Roleplay</span></div>
                </div>
              </motion.div>

              {/* Top-right: Student card */}
              <motion.div
                custom={1} initial="hidden" animate="visible" variants={floatIn}
                className="absolute right-0 top-0 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 rotate-6 hover:rotate-3 transition-transform duration-500"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-secondary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-brand-secondary">A</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Alex M.</p>
                    <p className="text-[11px] text-gray-400">B2 · Business English</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>Lessons completed</span>
                    <span className="font-semibold text-gray-800">12</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
              </motion.div>

              {/* Center: Dashboard screenshot */}
              <motion.div
                custom={2} initial="hidden" animate="visible" variants={floatIn}
                className="absolute left-1/2 -translate-x-1/2 top-4 w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
              >
                <Image src="/images/dashboard.png" alt="Avidato dashboard" width={840} height={560} className="w-full h-auto" priority />
              </motion.div>

              {/* Bottom-left: YouTube chip */}
              <motion.div
                custom={3} initial="hidden" animate="visible" variants={floatIn}
                className="absolute left-20 bottom-0 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3 rotate-3 hover:rotate-0 transition-transform duration-500"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">YouTube to Lesson</p>
                  <p className="text-[11px] text-gray-400">Paste any link</p>
                </div>
              </motion.div>

              {/* Bottom-right: Share chip */}
              <motion.div
                custom={4} initial="hidden" animate="visible" variants={floatIn}
                className="absolute right-16 bottom-6 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3 -rotate-3 hover:rotate-0 transition-transform duration-500"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <AutoAwesomeIcon className="w-4 h-4 text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Share with student</p>
                  <p className="text-[11px] text-gray-400">No login needed</p>
                </div>
              </motion.div>
            </div>

            {/* Mobile: single screenshot */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.55 }}
              className="mt-12 md:hidden mx-auto max-w-sm"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <Image src="/images/dashboard.png" alt="Avidato dashboard" width={840} height={560} className="w-full h-auto" priority />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  SOLUTIONS / DASHBOARD SHOWCASE                              */}
        {/* ============================================================ */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-6">
              <motion.div custom={0} variants={fadeUp}><SectionPill>Solutions</SectionPill></motion.div>
              <motion.h2 custom={1} variants={fadeUp} className="text-3xl md:text-[2.75rem] font-bold tracking-tight text-gray-900 leading-tight">
                Solve your biggest<br />lesson planning headaches
              </motion.h2>
            </motion.div>

            {/* Three value props */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 mb-14">
              {[
                { icon: '✦', text: 'Generate complete, structured lesson plans that actually follow a teaching flow.' },
                { icon: '≡', text: 'Keep student profiles, lessons, and notes organized so nothing gets lost.' },
                { icon: '↗', text: 'Share polished lesson links with students. No PDFs, no sign-ups required.' },
              ].map((item, i) => (
                <motion.div key={i} custom={i} variants={fadeUp} className="text-center px-4">
                  <span className="text-2xl mb-3 block">{item.icon}</span>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Big screenshot on gradient */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, ease: ease as unknown as [number, number, number, number] }}
              className="max-w-4xl mx-auto rounded-3xl p-4 md:p-6 bg-gradient-to-b from-sky-400 to-brand-primary"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <Image src="/images/dashboard.png" alt="Avidato dashboard overview" width={1200} height={800} className="w-full h-auto" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  FEATURES  (Bento Grid)                                      */}
        {/* ============================================================ */}
        <section id="features" className="py-20 md:py-28 bg-[#f5f5f5]">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-14">
              <motion.div custom={0} variants={fadeUp}><SectionPill>Features</SectionPill></motion.div>
              <motion.h2 custom={1} variants={fadeUp} className="text-3xl md:text-[2.75rem] font-bold tracking-tight text-gray-900 leading-tight">
                Keep everything in one place
              </motion.h2>
              <motion.p custom={2} variants={fadeUp} className="mt-3 text-gray-500 max-w-md mx-auto">
                Forget scattered Google Docs and half-finished lesson notes.
              </motion.p>
            </motion.div>

            {/* Bento grid: 2 large on top, 2 wide on bottom */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1: AI Lesson Plans (tall) */}
              <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Lesson Plans</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">Generate a full 50-minute lesson with warm-ups, vocabulary, exercises and discussion in under a minute.</p>
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <Image src="/images/detailed-lesson-plans-screenshot.png" alt="AI lesson plans" width={600} height={400} className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500" />
                </div>
              </motion.div>

              {/* Card 2: Student Hub */}
              <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Student Hub</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">One place for every student: notes, levels, goals, and every lesson you have generated for them.</p>
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <Image src="/images/simple-student-hub-screenshot.png" alt="Student hub" width={600} height={400} className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500" />
                </div>
              </motion.div>

              {/* Card 3: YouTube to Lesson (wide, with text left, image right) */}
              <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300 md:col-span-1"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">YouTube to Lesson</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">Paste a YouTube link. Get a structured ESL lesson with idioms, discussion questions and fill-in-the-blanks.</p>
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <Image src="/images/ai-course-outlines-screenshot.png" alt="YouTube to lesson" width={600} height={400} className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500" />
                </div>
              </motion.div>

              {/* Card 4: Shareable Links */}
              <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300 md:col-span-1"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Shareable Links</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">Send a clean, read-only link to your student. They see the lesson instantly, no login or app download needed.</p>
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <Image src="/images/shareable-links-screenshot.png" alt="Shareable links" width={600} height={400} className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  HOW IT WORKS                                                */}
        {/* ============================================================ */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-14">
              <motion.div custom={0} variants={fadeUp}><SectionPill>How it works</SectionPill></motion.div>
              <motion.h2 custom={1} variants={fadeUp} className="text-3xl md:text-[2.75rem] font-bold tracking-tight text-gray-900 leading-tight">
                From zero to lesson<br />in three steps
              </motion.h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-3xl mx-auto">
              {[
                { num: '01', title: 'Add your student', desc: 'Enter their level, goals, and interests. Takes 30 seconds.' },
                { num: '02', title: 'Generate a lesson', desc: 'Pick a topic or paste a YouTube link. The AI builds a complete lesson plan.' },
                { num: '03', title: 'Teach and share', desc: 'Use it in class, edit anything, then share the student version with one click.' },
              ].map((step, i) => (
                <motion.div key={step.num} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} className="text-center">
                  <span className="text-5xl font-extrabold text-brand-primary/15 block">{step.num}</span>
                  <h3 className="text-base font-semibold text-gray-900 mt-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  PEDAGOGY                                                    */}
        {/* ============================================================ */}
        <section id="pedagogy" className="py-20 md:py-28 bg-[#f5f5f5]">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-14">
              <motion.div custom={0} variants={fadeUp}><SectionPill>Pedagogy</SectionPill></motion.div>
              <motion.h2 custom={1} variants={fadeUp} className="text-3xl md:text-[2.75rem] font-bold tracking-tight text-gray-900 leading-tight">
                Grounded in teaching science
              </motion.h2>
              <motion.p custom={2} variants={fadeUp} className="mt-3 text-gray-500 max-w-lg mx-auto">
                Lessons are structured using methodologies you already know and trust, not just freeform AI output.
              </motion.p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {[
                { title: 'Communicative Language Teaching', abbr: 'CLT', desc: 'Focuses on real-life communication. Emphasizes fluency, interaction, and meaning over grammar drills.' },
                { title: 'Task-Based Language Teaching', abbr: 'TBLT', desc: 'Students complete meaningful tasks like planning a trip. Grammar and vocabulary emerge naturally from task needs.' },
                { title: 'The Lexical Approach', abbr: 'Lexical', desc: 'Prioritizes vocabulary chunks and collocations instead of grammar rules. Builds fluency through pattern recognition.' },
              ].map((method, i) => (
                <motion.div key={method.abbr} custom={i} variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
                  <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">{method.abbr}</span>
                  <h3 className="text-base font-semibold text-gray-900 mt-2 mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{method.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  TESTIMONIALS                                                */}
        {/* ============================================================ */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-14">
              <motion.div custom={0} variants={fadeUp}><SectionPill>Testimonials</SectionPill></motion.div>
              <motion.h2 custom={1} variants={fadeUp} className="text-3xl md:text-[2.75rem] font-bold tracking-tight text-gray-900 leading-tight">
                Teachers just like you<br />are already using Avidato
              </motion.h2>
            </motion.div>

            {/* Masonry-ish grid */}
            <div className="max-w-4xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeUp}
                  className="break-inside-avoid bg-[#f5f5f5] rounded-2xl border border-gray-100 p-6"
                >
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-brand-primary">{t.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  PRICING                                                     */}
        {/* ============================================================ */}
        <section id="pricing" className="py-20 md:py-28 bg-[#f5f5f5]">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-14">
              <motion.div custom={0} variants={fadeUp}><SectionPill>Pricing</SectionPill></motion.div>
              <motion.h2 custom={1} variants={fadeUp} className="text-3xl md:text-[2.75rem] font-bold tracking-tight text-gray-900 leading-tight">
                Simple pricing plans
              </motion.h2>
            </motion.div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
              {pricingPlans.map((plan, i) => (
                <motion.div
                  key={plan.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUp}
                  className={`rounded-2xl border p-7 flex flex-col ${
                    plan.popular
                      ? 'bg-brand-primary text-white border-brand-primary shadow-xl md:-mt-4 md:pb-10'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  {plan.popular && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-secondary mb-2">Best choice</span>
                  )}
                  <h3 className={`text-lg font-semibold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.title}</h3>
                  <p className={`text-sm mt-0.5 mb-4 ${plan.popular ? 'text-white/70' : 'text-gray-400'}`}>{plan.subtitle}</p>
                  <p className="mb-5">
                    <span className={`text-4xl font-extrabold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>${plan.price}</span>
                    <span className={`text-sm ${plan.popular ? 'text-white/60' : 'text-gray-400'}`}>/mo</span>
                  </p>
                  <Link
                    href="/signup"
                    className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                      plan.popular
                        ? 'bg-white text-brand-primary hover:bg-gray-100'
                        : 'bg-brand-primary text-white hover:bg-brand-dark'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircleIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-white/80' : 'text-brand-primary'}`} />
                        <span className={`text-sm ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  FAQ                                                         */}
        {/* ============================================================ */}
        <section id="faq" className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-12">
              <motion.div custom={0} variants={fadeUp}><SectionPill>FAQ</SectionPill></motion.div>
              <motion.h2 custom={1} variants={fadeUp} className="text-3xl md:text-[2.75rem] font-bold tracking-tight text-gray-900 leading-tight">
                Common questions
              </motion.h2>
            </motion.div>

            <div className="max-w-2xl mx-auto space-y-2">
              {faqData.map((faq, i) => (
                <motion.div
                  key={faq.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeUp}
                  className={`rounded-xl border transition-all ${
                    expandedFaq === faq.id ? 'bg-white shadow-md border-gray-200' : 'bg-transparent border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? false : faq.id)}
                    className="w-full flex justify-between items-center text-left p-5"
                  >
                    <span className={`font-semibold text-sm ${expandedFaq === faq.id ? 'text-brand-primary' : 'text-gray-800'}`}>
                      {faq.question}
                    </span>
                    <AddIcon className={`w-5 h-5 text-brand-primary transition-transform flex-shrink-0 ml-4 ${expandedFaq === faq.id ? 'rotate-45' : ''}`} />
                  </button>
                  {expandedFaq === faq.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-5 pb-5">
                      <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  FINAL CTA                                                   */}
        {/* ============================================================ */}
        <section className="py-20 md:py-28 bg-[#f5f5f5]">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="max-w-lg mx-auto text-center">
              <motion.h2 custom={0} variants={fadeUp} className="text-3xl md:text-[2.75rem] font-bold tracking-tight text-gray-900 leading-tight">
                Ready to teach smarter?
              </motion.h2>
              <motion.p custom={1} variants={fadeUp} className="mt-4 text-base text-gray-500">
                Join thousands of ESL teachers who spend less time planning and more time teaching.
              </motion.p>
              <motion.div custom={2} variants={fadeUp} className="mt-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center px-8 py-3.5 text-base font-semibold text-white bg-brand-primary rounded-full hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/20"
                >
                  Get started for free
                  <ArrowForwardIcon className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}