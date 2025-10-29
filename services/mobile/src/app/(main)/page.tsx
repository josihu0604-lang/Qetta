/**
 * Mobile Home Page - Redirects to Dashboard
 * 
 * Phase 3: Core mobile pages are now the primary experience.
 * Landing page components (Hero, Features, etc.) are preserved for marketing.
 */

import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect authenticated users to dashboard
  // TODO: Add authentication check when auth is implemented
  redirect('/dashboard');
}
