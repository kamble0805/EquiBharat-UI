'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Scale, Info, CheckCircle, Mail } from 'lucide-react';

const TermSection = ({ icon: Icon, title, content }: { icon: any, title: string, content: React.ReactNode }) => (
  <section className="mb-12 border-l-2 border-blue-500/20 pl-6 md:pl-10 relative">
    <div className="absolute left-[-11px] top-1 w-5 h-5 rounded-full bg-[#020617] border-2 border-blue-500 flex items-center justify-center">
      <Icon className="w-2.5 h-2.5 text-blue-500" />
    </div>
    <h2 className="text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-tight italic">
      {title}
    </h2>
    <div className="text-slate-400 text-sm md:text-base leading-relaxed space-y-4 font-medium">
      {content}
    </div>
  </section>
);

const TermsPage = () => {
  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-20 bg-[#02030a] text-slate-200">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center md:text-left"
        >
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            <span className="text-[10px] font-black tracking-[0.4em] text-blue-500 uppercase">Institutional Framework</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 italic">
            TERMS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400 not-italic uppercase">CONDITIONS</span>
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-4">
             <span className="text-xs font-mono text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded">Last Updated: Mar 31, 2026</span>
          </div>
        </motion.div>

        {/* Intro */}
        <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/50 p-8 rounded-2xl mb-16 shadow-2xl">
          <p className="text-slate-300 leading-relaxed italic text-lg">
            "Welcome to EquiBharat. By accessing or using this website, you agree to be bound by the following Terms & Conditions. If you do not agree with any part of these terms, please discontinue use of the platform."
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          
          <TermSection 
            icon={Info}
            title="1. Nature of the Platform"
            content={
              <p>
                EquiBharat is a financial news and information platform that provides simplified economic calendars, short-form financial articles, and market-related updates. The platform is free to use at present. Certain features such as community forums, alerts, or premium tools may require user registration or paid membership in the future. A majority of the platform will continue to remain freely accessible.
              </p>
            }
          />

          <TermSection 
            icon={Shield}
            title="2. No Investment Advice"
            content={
              <>
                <p>EquiBharat is not registered with SEBI or any financial regulatory authority and does not function as an investment advisor, broker, or advisory service.</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                   <li className="bg-slate-950/50 p-4 border border-slate-900 rounded-xl flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">No Buy/Sell Signals</span>
                   </li>
                   <li className="bg-slate-950/50 p-4 border border-slate-900 rounded-xl flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">No Investment Advice</span>
                   </li>
                   <li className="bg-slate-950/50 p-4 border border-slate-900 rounded-xl flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">No Price Targets</span>
                   </li>
                </ul>
                <p className="mt-8 font-black text-white bg-blue-500/10 px-4 py-2 rounded inline-block">
                  All content is strictly for informational and educational purposes only.
                </p>
              </>
            }
          />

          <TermSection 
            icon={Scale}
            title="3. User Responsibility & Risk Disclosure"
            content={
              <div className="space-y-4">
                <p>Financial markets involve risk. Users acknowledge that:</p>
                <ul className="space-y-2 list-disc pl-5 marker:text-blue-500">
                  <li>Any decisions made based on information from EquiBharat are their sole responsibility.</li>
                  <li>EquiBharat shall not be held liable for financial losses or outcomes.</li>
                  <li>Users are encouraged to conduct independent research or consult qualified professionals.</li>
                </ul>
              </div>
            }
          />

          <TermSection 
            icon={CheckCircle}
            title="4. Accuracy & Limitations"
            content={
              <ul className="space-y-2 list-disc pl-5 marker:text-blue-500">
                <li>Data may change, contain delays, or include unintentional errors.</li>
                <li>Information may become outdated without notice.</li>
                <li>EquiBharat makes no guarantee regarding accuracy, completeness, or reliability.</li>
                <li>Use of information is entirely at the user’s discretion.</li>
              </ul>
            }
          />

          <TermSection 
            icon={Info}
            title="5. Third-Party Content & Widgets"
            content={
              <ul className="space-y-2 list-disc pl-5 marker:text-blue-500">
                <li>EquiBharat may use third-party tools, widgets, feeds, or external links for convenience.</li>
                <li>We do not control third-party content.</li>
                <li>We are not responsible for accuracy, availability, or reliability of external services.</li>
                <li>Users access third-party content at their own risk.</li>
              </ul>
            }
          />

          <TermSection 
            icon={Shield}
            title="6. User Accounts & Community Features"
            content={
              <p>Creating an account is optional. However, certain features such as community forums, alerts, notifications, or interactive features may require registration. Users are responsible for maintaining account security and for all activity conducted through their account.</p>
            }
          />

          <TermSection 
            icon={FileText}
            title="7. User-Generated Content"
            content={
              <div className="space-y-4">
                <p>By submitting content to community sections, users confirm that:</p>
                <ul className="space-y-2 list-disc pl-5 marker:text-blue-500">
                  <li>They own the content or have the right to share it.</li>
                  <li>Content does not violate laws or third-party rights.</li>
                </ul>
                <p>EquiBharat reserves the right to remove or moderate content at its discretion.</p>
              </div>
            }
          />

          <TermSection 
            icon={Scale}
            title="8. Intellectual Property & Content Usage"
            content={
              <ul className="space-y-2 list-disc pl-5 marker:text-blue-500">
                <li>All original content published belongs to EquiBharat unless otherwise stated.</li>
                <li>Users may quote or share small portions with proper credit.</li>
                <li>Screenshots or references are permitted with attribution.</li>
                <li>Full reproduction, scraping, or commercial reuse without permission is prohibited.</li>
              </ul>
            }
          />

          <TermSection 
            icon={Shield}
            title="9. Prohibited Activities"
            content={
              <ul className="space-y-2 list-disc pl-5 marker:text-blue-500">
                <li>Automated scraping or bot activity.</li>
                <li>Data harvesting or reverse engineering.</li>
                <li>Misuse of platform content.</li>
                <li>Any activity that disrupts platform functionality.</li>
              </ul>
            }
          />

          <TermSection 
            icon={Info}
            title="10. Advertisements & Monetization"
            content={
              <p>EquiBharat may display advertisements or affiliate links in the future. Currently, the platform may operate without ads, but this may change without obligation to notify users.</p>
            }
          />

          <TermSection 
            icon={CheckCircle}
            title="11. Website Availability"
            content={
              <p>EquiBharat does not guarantee uninterrupted access. The website may be unavailable due to maintenance, technical issues, or external dependencies. No liability is assumed for downtime.</p>
            }
          />

          <TermSection 
            icon={Scale}
            title="12. Modification of Terms"
            content={
              <p>EquiBharat reserves the right to modify these Terms & Conditions at any time without prior notice. Continued use of the platform constitutes acceptance of updated terms.</p>
            }
          />

          <TermSection 
            icon={Shield}
            title="13. Termination of Access"
            content={
              <p>EquiBharat reserves the right to restrict or terminate user access, remove content, or suspend accounts without obligation to provide justification.</p>
            }
          />

          <TermSection 
            icon={Info}
            title="14. Future Services"
            content={
              <p>EquiBharat may expand, modify, or discontinue services in the future, including paid memberships or additional features.</p>
            }
          />

          <TermSection 
            icon={Scale}
            title="15. Governing Law & Jurisdiction"
            content={
              <p>These Terms shall be governed by the laws of India. Any disputes shall fall under the jurisdiction of courts in Mumbai, Maharashtra.</p>
            }
          />

          <TermSection 
            icon={Mail}
            title="16. Contact Information"
            content={
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
                 <p className="mb-4 text-slate-300">For any questions or concerns regarding these Terms:</p>
                 <a href="mailto:news@equiBharat.com" className="text-2xl font-black text-blue-400 hover:text-emerald-400 transition-colors tracking-tight">
                    news@equiBharat.com
                 </a>
              </div>
            }
          />

        </div>

        {/* Footer Note */}
        <div className="mt-20 pt-8 border-t border-slate-800/60 text-center text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
           EquiBharat Institutional Intelligence Pipeline
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
