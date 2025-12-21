import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCurrentCompany } from '@/lib/supabase-service';

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { amount } = await req.json(); // amount in cents
  const company = await getCurrentCompany();
  
  if (!company) return NextResponse.json({ error: 'No company' }, { status: 401 });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Пополнение баланса Workfound',
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    // Передаем company_id в метадате, чтобы потом (в вебхуке или success) знать, кому начислять
    metadata: {
      company_id: company.id,
      type: 'deposit'
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/employer/billing/deposit-success?session_id={CHECKOUT_SESSION_ID}&amount=${amount}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/employer/billing`,
  });

  return NextResponse.json({ url: session.url });
}
