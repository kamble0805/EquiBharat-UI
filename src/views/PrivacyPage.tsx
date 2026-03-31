'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Cookie, UserCheck, Share2, Database, Mail, Info, CheckCircle, Scale } from 'lucide-react';

const PrivacySection = ({ icon: Icon, title, content }: { icon: any, title: string, content: React.ReactNode }) => (
  <section className="mb-12 border-l-2 border-emerald-500/20 pl-6 md:pl-10 relative">
    <div className="absolute left-[-11px] top-1 w-5 h-5 rounded-full bg-[#02030a] border-2 border-emerald-500 flex items-center justify-center">
      <Icon className="w-2.5 h-2.5 text-emerald-500" />
    </div>
    <h2 className="text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-tight italic">
      {title}
    </h2>
    <div className="text-slate-400 text-sm md:text-base leading-relaxed space-y-4 font-medium">
      {content}
    </div>
  </section>
);

const PrivacyPage = () => {
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
            <span className="text-[10px] font-black tracking-[0.4em] text-emerald-500 uppercase">Data Safeguard Protocol</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 italic">
            PRIVACY <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500 not-italic uppercase">POLICY</span>
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-4">
             <span className="text-xs font-mono text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded">Last Updated: Mar 31, 2026</span>
          </div>
        </motion.div>

        {/* Intro */}
        <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/50 p-8 rounded-2xl mb-16 shadow-2xl">
          <p className="text-slate-300 leading-relaxed italic text-lg">
            "At EquiBharat, we respect your privacy and are committed to protecting the information you share with us. This Privacy Policy explains how we collect, use, and handle information when you access or use our website and services."
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          
          <PrivacySection 
            icon={Database}
            title="1. Information We Collect"
            content={
              <div className="space-y-4">
                <p>EquiBharat may collect personal information only when certain features are enabled or used. This includes information you provide directly:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                   <li className="bg-slate-950/50 p-4 border border-slate-900 rounded-xl flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Name</span>
                   </li>
                   <li className="bg-slate-950/50 p-4 border border-slate-900 rounded-xl flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</span>
                   </li>
                   <li className="bg-slate-950/50 p-4 border border-slate-900 rounded-xl flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone Number</span>
                   </li>
                   <li className="bg-slate-950/50 p-4 border border-slate-900 rounded-xl flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Credentials</span>
                   </li>
                </ul>
                <p className="italic text-slate-500 text-sm">Currently, most content on EquiBharat is accessible without registration.</p>
              </div>
            }
          />

          <PrivacySection 
            icon={UserCheck}
            title="2. Account Registration"
            content={
              <p>User registration is optional and is required only for specific features such as community forums, email alerts, notifications, or future premium/membership features. Users can browse the website without creating an account.</p>
            }
          />

          <PrivacySection 
            icon={Mail}
            title="3. Email Communication"
            content={
              <div className="space-y-4">
                <p>EquiBharat may send emails related to news alerts, daily updates, or platform announcements. Users can unsubscribe from communications at any time.</p>
                <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Active Opt-out mechanism maintained for all users.
                </div>
              </div>
            }
          />

          <PrivacySection 
            icon={Cookie}
            title="4. Cookies & Analytics"
            content={
              <p>EquiBharat uses cookies and tracking technologies (such as Google Analytics) for website analytics and platform optimization. These tools may automatically collect non-personal information such as browser type or usage patterns.</p>
            }
          />

          <PrivacySection 
            icon={Eye}
            title="5. Advertising & Ad Cookies"
            content={
              <p>In the future, we may display ads through providers like Google AdSense. These providers may use cookies to display relevant advertisements. EquiBharat does not control how third-party advertisers collect or use data.</p>
            }
          />

          <PrivacySection 
            icon={Lock}
            title="6. IP Address & Technical Information"
            content={
              <p>Automatically collected limited technical information (IP address, browser type) is used solely for analytics, security, and platform optimization.</p>
            }
          />

          <PrivacySection 
            icon={UserCheck}
            title="7. Forums & Public Content"
            content={
              <div className="space-y-4">
                <p>Any content shared by users in forums is publicly visible. Users are solely responsible for their posts. Previously posted public content may remain visible even after account deletion.</p>
                <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20 text-xs font-bold text-red-400 uppercase tracking-widest">
                   Exercise caution when sharing personal information publicly.
                </div>
              </div>
            }
          />

          <PrivacySection 
            icon={Share2}
            title="8. Data Sharing"
            content={
              <div className="space-y-4">
                <p>EquiBharat does not sell or trade user data. We share limited information only with trusted service providers assisting in platform operation (hosting, analytics, email delivery).</p>
              </div>
            }
          />

          <PrivacySection 
            icon={Database}
            title="9. Data Storage"
            content={
              <p>Any information collected is stored only as necessary to provide the intended service and may be processed using secure third-party tools or cloud services.</p>
            }
          />

          <PrivacySection 
            icon={Info}
            title="10. Third-Party Links"
            content={
              <p>EquiBharat may include links to external websites. We are not responsible for the privacy practices of external sites and encourage users to review their policies separately.</p>
            }
          />

          <PrivacySection 
            icon={Scale}
            title="14. Legal Compliance"
            content={
              <p>This Privacy Policy is governed by applicable laws in India, including relevant data protection and information technology regulations.</p>
            }
          />

          <PrivacySection 
            icon={Mail}
            title="16. Contact Us"
            content={
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
                 <p className="mb-4 text-slate-300">For any questions, concerns, or requests regarding privacy:</p>
                 <a href="mailto:news@equiBharat.com" className="text-2xl font-black text-emerald-400 hover:text-blue-400 transition-colors tracking-tight">
                    news@equiBharat.com
                 </a>
              </div>
            }
          />

        </div>

        {/* Footer Note */}
        <div className="mt-20 pt-8 border-t border-slate-800/60 text-center text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
           EquiBharat Data Protection Protocol
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
