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
        price: 'price_1RmaN8CAVp7xmAFpmiDR1xT4', // Replace with your Stripe Price ID
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/`,
    cancel_url: `${process.env.NEXTAUTH_URL}/subscribe`,
    metadata: { user_id: user.id },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
