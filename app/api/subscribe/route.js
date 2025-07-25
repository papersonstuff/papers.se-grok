import { createSupabaseServerClient } from '../../../utils/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: 'price_1RmaN8CAVp7xmAFpmiDR1xT4',  // Verify this in Stripe dashboard > Products > Your subscription product > Pricing ID
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `https://www.papers.se/`,  // Changed to hardcoded site URL
    cancel_url: `https://www.papers.se/subscribe`,
    metadata: { user_id: user.id },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
