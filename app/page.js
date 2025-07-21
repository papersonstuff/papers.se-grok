import { createSupabaseServerClient } from '../utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = createSupabaseServerClient();
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

  // Fetch news from news.json (or your API)
  // Example: Read news.json or fetch from Supabase
  return (
    <div>
      <h1>AI News</h1>
      {/* Render news from news.json */}
      <p>News content goes here</p>
    </div>
  );
}
