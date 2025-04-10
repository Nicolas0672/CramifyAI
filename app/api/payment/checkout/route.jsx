import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
    const { priceId } = await req.json();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    try{
    const session = await stripe.checkout.sessions.create({
        mode: 'payment', // Changed from 'subscription' to 'payment' for one-time charge
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        payment_method_types: ['card'], // Ensures only card payments are allowed
        success_url: `${process.env.HOST_URL}/dashboard/thank-you`,
        cancel_url: process.env.HOST_URL,
    });

    return NextResponse.json(session);
} catch(err) {NextResponse.json('error'+err)}
}
