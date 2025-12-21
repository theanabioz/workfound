import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { jobId, planId } = await req.json();
  
  // Определяем цену
  const price = planId === 'top_7' ? 2000 : 500; // cents

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: planId === 'top_7' ? 'ТОП на 7 дней' : 'Выделение цветом',
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/employer/billing/success?session_id={CHECKOUT_SESSION_ID}&job_id=${jobId}&plan_id=${planId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/employer/jobs/${jobId}/promote`,
  });

  return NextResponse.json({ url: session.url });
}
