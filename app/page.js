import { createSupabaseServerClient } from '../utils/supabase/server';
import { redirect } from 'next/navigation';
import NewsGrid from './NewsGrid';

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  if (!subscription) {
    redirect('/subscribe');
  }

  // Load initial news from news.json on server
  const newsData = await import('../../news.json');

  return <NewsGrid initialNews={newsData.default} />;
}