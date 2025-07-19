import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '../../../utils/supabaseClient';  // Adjust path if needed

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Update Supabase with subscription status (use email or metadata to find user)
    await supabase
      .from('subscriptions')
      .upsert({
        user_email: session.customer_email,  // Or use user ID if passed in metadata
        stripe_id: session.subscription,
        status: 'active',
      });
  } else if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object;
    // Update status if canceled or failed
    await supabase
      .from('subscriptions')
      .update({ status: subscription.status })
      .eq('stripe_id', subscription.id);
  }

  return NextResponse.json({ received: true });
}
