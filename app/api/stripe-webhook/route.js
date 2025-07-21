import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const signature = request.headers.get('stripe-signature');
  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.user_id;
    if (!userId) {
      console.error('No user_id in session metadata');
      return new Response('Missing user_id in metadata', { status: 400 });
    }
    const { error } = await supabaseAdmin.from('subscriptions').insert({
      user_id: userId,
      stripe_id: session.id,
      status: 'active',
    });
    if (error) {
      console.error('Supabase insert error:', error.message);
      return new Response(`Database Error: ${error.message}`, { status: 500 });
    }
  }

  return new Response('Success', { status: 200 });
}
