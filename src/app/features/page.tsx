'use client';

import React, { useState } from 'react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import CheckCircleIcon from '@/components/icons/CheckCircleIcon';
import AutoAwesomeIcon from '@/components/icons/AutoAwesomeIcon';
import FactCheckIcon from '@/components/icons/FactCheckIcon';
import ManageAccountsIcon from '@/components/icons/ManageAccountsIcon';
import ShareIcon from '@/components/icons/ShareIcon';
import SchemaIcon from '@/components/icons/SchemaIcon';
import TaskAltIcon from '@/components/icons/TaskAltIcon';
import RuleIcon from '@/components/icons/RuleIcon';

const features = [
  {
    icon: <AutoAwesomeIcon className="h-12 w-12 text-brand-primary" />,
    title: 'AI Course Outlines',
    imageName: 'ai-course-outlines-screenshot.png',
    description: 'Instantly generate a 10-lesson course outline based on your student\'s proficiency level and learning goals. Customize the structure and pacing to match your teaching style.',
    details: [
      'Automatic difficulty progression',
      'Student proficiency assessment',
      'Customizable lesson count',
      'Learning goal alignment',
    ]
  },
  {
    icon: <FactCheckIcon className="h-12 w-12 text-brand-secondary" />,
    title: 'Detailed Lesson Plans',
    imageName: 'detailed-lesson-plans-screenshot.png',
    description: 'Go from outline to a complete, structured lesson plan with warm-ups, activities, and vocabulary in a single click. Every lesson is pedagogically sound and ready to teach.',
    details: [
      'Structured lesson format',
      'Warm-up and cool-down activities',
      'Vocabulary lists with pronunciation',
      'Grammar explanations',
      'Interactive activities',
    ]
  },
  {
    icon: <ManageAccountsIcon className="h-12 w-12 text-brand-accent" />,
    title: 'Simple Student Hub',
    imageName: 'simple-student-hub-screenshot.png',
    description: 'Keep all your student notes, progress, and generated lesson plans organized in one central dashboard. Never lose track of your teaching materials again.',
    details: [
      'Student profile management',
      'Progress tracking',
      'Lesson history archive',
      'Performance analytics',
      'Student notes and feedback',
    ]
  },
  {
    icon: <ShareIcon className="h-12 w-12 text-brand-dark" />,
    title: 'Shareable Links',
    imageName: 'shareable-links-screenshot.png',
    description: 'Send a read-only link of the lesson plan to your student. No login required for them to view the materials. Perfect for remote learning.',
    details: [
      'Unique public links',
      'No login required',
      'Beautiful formatting',
      'Mobile responsive',
      'Printable format',
    ]
  },
];

const methodologies = [
  {
    id: 'CLT',
    title: 'Communicative Language Teaching (CLT)',
    description: 'Focuses on real-life communication. Emphasizes fluency, interaction, and meaning over grammar drills. Core tools: role-plays, discussions, task-based activities. Perfect for students who prefer speaking-based material.',
    icon: <SchemaIcon className="h-12 w-12" />
  },
  {
    id: 'TBLT',
    title: 'Task-Based Language Teaching (TBLT)',
    description: 'Students complete meaningful tasks (e.g., planning a trip, solving a problem). Grammar and vocabulary emerge naturally from task needs. Strong for advanced learners who want practical application.',
    icon: <TaskAltIcon className="h-12 w-12" />
  },
  {
    id: 'LEXICAL',
    title: 'The Lexical Approach',
    description: 'Prioritizes vocabulary chunks and collocations instead of grammar rules. Focus on noticing and using common word combinations to sound more natural. Builds fluency through pattern recognition.',
    icon: <RuleIcon className="h-12 w-12" />
  },
];

export default function FeaturesPage() {
  const [activeMethod, setActiveMethod] = useState('CLT');
  const currentMethod = methodologies.find(m => m.id === activeMethod);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicNavbar />

      <main className="flex-grow">
        {/* === HERO SECTION === */}
        <section className="py-20 md:py-28 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Modern Teachers
            </h1>
            <p className="text-xl text-gray-600">
              Everything you need to create engaging, personalized lessons in minutes. No more hours spent on preparation.
            </p>
          </div>
        </section>

        {/* === CORE FEATURES SECTION === */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16 text-center">
              Core Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img 
                      src={`/images/${feature.imageName}`}
                      alt={`${feature.title} Screenshot`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      {feature.icon}
                      <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === VIDEO DEMOS SECTION === */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Watch how easy it is to use Avidato for common tasks
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Ordering Food Video */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-64 bg-gray-900 flex items-center justify-center">
                  <iframe 
                    src="https://drive.google.com/file/d/1HVpKvnmciGuY75wdwWDXidsNlABymtXE/preview"
                    width="100%"
                    height="100%"
                    allow="autoplay"
                    className="border-0"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Ordering Food Lesson</h3>
                  <p className="text-gray-600">Watch how to create an engaging lesson about ordering food with real-world vocabulary and interactive role-plays.</p>
                </div>
              </div>

              {/* Adding Students Video */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-64 bg-gray-900 flex items-center justify-center">
                  <iframe 
                    src="https://drive.google.com/file/d/1ZN96L68QRZ-9CizlkyPMn0lnCarZFGvK/preview"
                    width="100%"
                    height="100%"
                    allow="autoplay"
                    className="border-0"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Adding Students</h3>
                  <p className="text-gray-600">Learn how to quickly add students to your dashboard and start generating personalized lessons for them.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === TEACHING METHODOLOGIES SECTION === */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Multiple Teaching Methodologies
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Choose your preferred teaching approach. Avidato supports three proven language teaching methodologies to match your unique teaching style.
            </p>

            {/* Tabs */}
            <div className="flex flex-col md:flex-row gap-6 mb-12">
              {methodologies.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setActiveMethod(method.id)}
                  className={`flex-1 p-6 rounded-xl transition-all ${
                    activeMethod === method.id
                      ? 'bg-brand-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`${activeMethod === method.id ? 'text-white' : 'text-brand-primary'}`}>
                      {method.icon}
                    </span>
                    <h3 className="font-bold text-left">{method.title}</h3>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Method Details */}
            {currentMethod && (
              <div className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-2xl p-12 border border-brand-primary/20">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentMethod.title}</h3>
                <p className="text-lg text-gray-700 leading-relaxed">{currentMethod.description}</p>
              </div>
            )}
          </div>
        </section>

        {/* === ADVANTAGES SECTION === */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Why Teachers Love Avidato
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <CheckCircleIcon className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Save Prep Time</h3>
                  <p className="text-gray-600">Reduce lesson planning from hours to minutes, giving you more time to focus on your students.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircleIcon className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Lessons</h3>
                  <p className="text-gray-600">Every lesson is tailored to your student&apos;s proficiency level and learning goals.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircleIcon className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Quality</h3>
                  <p className="text-gray-600">Get pedagogically sound lessons that follow proven language teaching frameworks.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircleIcon className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Easy to Customize</h3>
                  <p className="text-gray-600">Every lesson is a starting point. Customize and adapt to match your unique teaching style.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircleIcon className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Student Engagement</h3>
                  <p className="text-gray-600">Structured, interactive lessons keep students engaged and motivated to learn.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircleIcon className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Organization</h3>
                  <p className="text-gray-600">Centralized dashboard keeps all your students and materials in one place.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === CTA SECTION === */}
        <section className="py-20 text-center px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Teaching?</h2>
            <p className="text-lg text-gray-600 mb-8">Start creating amazing lessons today. No credit card required.</p>
            <a href="/signup" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-brand-primary rounded-full hover:bg-brand-accent transition-colors">
              Get Started Free
            </a>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
