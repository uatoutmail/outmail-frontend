'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/component/ui/badge';
import { MinusIcon, PlusIcon } from 'lucide-react';

const faqItems = [
  {
    id: '1',
    question: 'What is Outmail?',
    answer:
      'Outmail is a simple yet powerful tool for students, fresh graduates, and job seekers to boost their job visibility by automating personalized email outreach directly to recruiters.',
    category: 'general',
  },
  {
    id: '2',
    question: 'How does Outmail work?',
    answer:
      'Connect your Gmail, choose from smart email templates, and launch a campaign. Outmail uses its own company intelligence — funding data, hiring signals, and industry trends — to target the right recruiters and send personalized emails on your behalf, safely and efficiently.',
    category: 'general',
  },
  {
    id: '3',
    question: 'Can I personalize my emails?',
    answer:
      'Yes! You can create and manage multiple email templates, and Outmail lets you tailor each campaign for different companies, roles, and industries.',
    category: 'technical',
  },
  {
    id: '4',
    question: 'Is my Gmail safe?',
    answer:
      'Absolutely. Outmail uses secure OAuth for Gmail connection, throttles sending to safe limits, and never stores your emails or shares your data.',
    category: 'technical',
  },
  {
    id: '5',
    question: 'How does Outmail find the right companies for me?',
    answer:
      'Outmail uses its own live company intelligence — tracking funding rounds, hiring signals, job openings, and industry trends — to surface the most relevant companies for your outreach. You never need to upload or manage contact lists yourself.',
    category: 'general',
  },
  {
    id: '6',
    question: 'How many emails can I send?',
    answer:
      'Sending limits depend on your plan. Outmail automatically throttles sends to keep your Gmail account safe and compliant with Gmail guidelines — so you get maximum reach without risking your account.',
    category: 'pricing',
  },
  {
    id: '7',
    question: 'Does Outmail guarantee a job?',
    answer:
      'No tool can guarantee a job, but Outmail guarantees your application will be seen by more recruiters, increasing your chances of landing interviews.',
    category: 'general',
  },
  {
    id: '8',
    question: 'Can I track my campaign status?',
    answer:
      'Yes, you can track the status of your campaigns and see which emails have been sent from your dashboard.',
    category: 'support',
  },
  {
    id: '9',
    question: 'What are Mentorship Sessions?',
    answer:
      'Outmail connects you with experienced professionals and alumni for live mentorship sessions. Growth and Campus plan users can book sessions, explore session types, and revisit past sessions — all within the dashboard.',
    category: 'general',
  },
  {
    id: '10',
    question: 'Does Outmail show real job openings?',
    answer:
      'Yes. The Job Openings section in your dashboard surfaces active roles with priority scoring based on hiring urgency, company momentum, and signals like recent funding. This helps you focus your outreach on the most promising opportunities.',
    category: 'general',
  },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'general', label: 'General' },
  { id: 'technical', label: 'Technical' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'support', label: 'Support' },
];

export default function Faq2() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filteredFaqs =
    activeCategory === 'all'
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="faq-section" className="min-h-screen bg-[#0a0b14] text-white font-syne py-16 pb-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 flex flex-col items-center">
          <Badge
            variant="outline"
            className="border-primary mb-4 px-10 py-1 text-xl font-medium tracking-wider uppercase"
          >
            FAQs
          </Badge>

          <h2 className="mb-6 text-center text-4xl font-bold tracking-tight md:text-5xl text-white">
            Frequently Asked Questions
          </h2>

        </div>

        {/* Category Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                activeCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-white/75 border border-white/12 hover:bg-white/10'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className={cn(
                'border border-white/12 bg-white/5 backdrop-blur-xl shadow-[0_0_18px_rgba(108,0,255,0.10)] h-fit overflow-hidden rounded-xl',
                expandedId === faq.id ? 'shadow-lg' : ''
              )}
              style={{ minHeight: '88px' }}
            >
              <button
                onClick={() => toggleExpand(faq.id)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                <div className="ml-4 flex-shrink-0">
                  {expandedId === faq.id ? (
                    <MinusIcon className="text-primary h-5 w-5" />
                  ) : (
                    <PlusIcon className="text-primary h-5 w-5" />
                  )}
                </div>
              </button>

              {expandedId === faq.id && (
                <div className="border-t border-white/12 px-6 pt-2 pb-6">
                  <p className="text-white/70">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="mb-4 text-white">Can’t find what you’re looking for?</p>
          <Link
            href="/contactus"
            className="px-4 py-3 bg-gradient-to-r from-[#6c00ff] to-[#ad46ff] text-white font-extrabold rounded-xl hover:brightness-110 transition"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}
