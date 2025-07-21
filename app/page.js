import { createSupabaseServerClient } from '../utils/supabase/server'; // Adjust path
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  // Check subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  if (!subscription) {
    // Redirect to Stripe checkout (your existing code)
    redirect('/subscribe');
  }

  // Show news content
  return <div>AI News Content Here (from news.json)</div>;
}
