'use client';
import dynamic from 'next/dynamic';

const ProfilePage = dynamic(() => import('@/views/ProfilePage'), {
  ssr: false,
  loading: () => null, // Or a loading spinner
});

export default function Page() {
  return <ProfilePage />;
}
