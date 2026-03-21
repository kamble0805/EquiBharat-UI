# EquiBharat – India Economic Intelligence

Advanced calendar-driven economic analysis platform for Indian equity markets. This platform provides real-time market insights, AI-enriched news, and structured economic event analysis.

## 🚀 Detailed Changelog & Recent Updates

### 🔐 Authentication & Security Logic
- **Full Backend Integration**: Successfully migrated the entire authentication flow (Login/Register) from client-side mock logic to a secure Node.js API connected to a MySQL backend.
- **Database Schema Validation**:
    - Identified and patched critical schema mismatches where the application assumed a `is_active` column and `updated_at` timestamps that were missing from the production table.
    - Updated registration API to correctly handle `INT AUTO_INCREMENT` IDs vs `VARCHAR(36)` UUIDs based on the actual database structure.
- **Improved Registration Flow**:
    - Added automatic **Username Generation** (email prefix + random string) to satisfy the database's `NOT NULL` unique requirement for usernames.
    - Implemented a "Register and Auto-Login" flow for a smoother onboarding experience.
- **Security Section Overhaul**:
    - **Password Changes**: The "Change Password" feature now performs a "Double Validation"—checking the current password against the hashed DB record before allowing an update.
    - **Session Logging**: Prepared the groundwork for `user_security_logs` and `user_sessions` tables.

### 👤 Profile & User Experience Persistence
- **Global Preference Sync**:
    - Created a new `PreferenceLoader` component at the root level (`Providers.tsx`).
    - **Instant Login Snap**: Preferences like **Dark Mode**, **Font Size (13px-22px)**, and **Compact Layout** now "snap" into place immediately upon login without requiring a page refresh.
    - **Automatic Reset**: Implemented a "Guest State" reset where preferences are cleared from the DOM when a user logs out, ensuring a standard view for public visitors.
- **Database-Stored Settings**:
    - Moved Theme, Font Size, Layout Density, Timezone, and Date format preferences from `localStorage` to a dedicated `user_display_preferences` table.
- **Profile Detail Management**:
    - Integrated real-time updates for Full Name, Phone, Job Title, and Bio. Updates are validated server-side and reflected instantly in the `AuthContext` without needing a re-login.
- **Section Visibility**:
    - Cleaned up the Profile sidebar by hiding the inactive "Notifications" and "Content Preferences" tabs until their corresponding backend modules are finalized.

### ✉️ Contact & Communications
- **Premium Contact Experience**:
    - **Redesigned View**: Built a split-pane contact page with professional glass-morphism cards and high-contrast typography.
    - **Subject Routing**: Added a `Subject` field to help categorize incoming inquiries.
    - **Message Success State**: Added a dedicated success screen with a `CheckCircle` animation to confirm delivery.
- **Hostinger SMTP Integration**:
    - Integrated the `nodemailer` library to handle real-time email notifications.
    - Configured the system specifically for **Hostinger Mail (titan/standard)** using SMTP Port **465** with SSL/TLS security.
    - Emails are sent from `info@equibharat.com` with a clean, branded HTML template.

### 📅 Calendar & Market Intelligence
- **Holiday Engine Integration**:
    - Built a standalone Holiday Management module that syncs with a `holidays` table in the database.
    - **Indian Market Holidays**: Seeded and displayed 2026 Indian market holidays (NSE/BSE) across the platform.
    - **Dual-View Support**: Integrated holidays into both the **Economic Calendar** (Timeline View) and the **Market Pulse** (Impending Events) widget.
    - **Display Logic**: Implemented "All Day" formatting for holidays to distinguish them from timestamped economic news.
- **AI-Enriched Economic Calendar**:
    - **Dynamic Schema Detection**: The calendar API now automatically detects whether the backend is using `news_events_ai` or `news_event_ai` tables and maps columns accordingly (`raw_event_id` vs `news_event_id`).
    - **Impact Analysis**: Integrated "Market Impact Explanations" and "Likely Affected Sectors" directly into the calendar event details, providing institutional-grade insights for retail traders.
- **Market Pulse Synchronization**:
    - **Live Sentiment Props**: The Market Pulse now combines global moods, India-specific bias, and top triggers with a real-time countdown of impending high-impact events and holidays.

### 📑 Database Schema Changes (Audit Trail)
- **Table Synchronisation**:
    - Audited the `users` table and aligned API queries to use only existing columns.
    - Verified the `forum_threads` and `forum_replies` tables for correctly handling integer-based primary keys.
    - **New `holidays` Table**: Integrated support for `id`, `name`, `date`, and `type` columns for regional market tracking.
    - **Dynamic AI Event Detection**: Switched to `information_schema.COLUMNS` lookups for `news_events_ai` to ensure zero-breakage deployments across different DB environments.

---

## 🛠️ Project Setup & Deployment

### Prerequisites
- **Node.js**: >= 20.x
- **Database**: MySQL 8.0+ (Highly optimized for Hostinger environments)

### Environment Configuration
Create a `.env` file in the root directory:

```env
# MySQL Database (Hostinger)
MYSQL_HOST=82.25.121.34
MYSQL_USER=u312866122_equi_back
MYSQL_PASSWORD=********
MYSQL_DATABASE=u312866122_equi_back

# SMTP / Email Configuration (Hostinger Webmail)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@equibharat.com
SMTP_PASS=********
CONTACT_RECEIVER_EMAIL=info@equibharat.com
```

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Access the app
# Local: http://localhost:3000
```

---

## 📦 Troubleshooting: Hostinger Deployment

### 1. Fix 'Permission denied' on Build
If your Hostinger deployment fails with a `Permission denied` error trying to execute the `next` binary, use the following `chmod` command in the Hostinger terminal (or SSH):

```bash
# Execute this to grant permissions to the Next.js binary
chmod +x ./node_modules/.bin/next
```

If it still fails, use the absolute path provided in your Hostinger panel:
```bash
chmod +x /home/u312866122/domains/eb2.visionnest.in/public_html/.builds/source/node_modules/.bin/next
```

---

### 2. Module Not Resolved (@/data/mockData)
If your build fails with `@/data/mockData could not be resolved`, ensures that `src/data/mockData.ts` exists. This file contains legacy types and data required by several widgets and pages. It has been restored to maintain build stability.

---

## 📁 Key Files & Modules
- `src/app/api/calendar/events/route.ts`: Schema-aware AI event and holiday aggregator.
- `src/app/api/market-pulse/route.ts`: Real-time market sentiment and impending event feed.
- `src/components/widgets/CalendarWidget.tsx`: Compact dashboard-integrated economic timeline.
- `src/views/CalendarPage.tsx`: Full-screen filtered economic intelligence view.
- `src/app/api/contact/route.ts`: Email dispatch logic using Hostinger SMTP.
- `src/components/PreferenceLoader.tsx`: Real-time synchronization of user settings from DB.
- `src/context/AuthContext.tsx`: Persistent authentication and profile state.
- `src/views/ContactPage.tsx`: Premium redesigned contact view.
- `src/app/api/auth/[login/register]`: Backend-connected identity management.
- `prepare-deploy.ps1`: PowerShell script to package the 'standalone' build for Hostinger.
