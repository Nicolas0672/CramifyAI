import { db } from "@/configs/db";
import { PAYMENT_USER_TABLE, USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Get the raw body as text
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEB_HOOK_KEY;
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
   
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }
    
    const data = event.data;
    const eventType = event.type;

    
    switch (eventType) {
      case 'checkout.session.completed':
        const transactionId = data.object.payment_intent || "no_payment_intent";
        const customerEmail = data.object.customer_details?.email;
        
        if (!customerEmail) {
       
          return NextResponse.json({ error: "No customer email in webhook data" }, { status: 400 });
        }
        
     
          // Check if user exists
          // Check if user exists
const userDb = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, customerEmail));

if (!userDb || userDb.length === 0) {
  // User doesn't exist - you might want to handle this case differently
  return NextResponse.json({ error: "User not found" }, { status: 400 });
} else {
  // Update existing user
  const oldPurchasedCredit = userDb[0].newPurchasedCredit || 0;
  const oldTotalCreditSize = userDb[0].totalCreditSize || 0;
  const newRemainCredit = userDb[0].remainingCredits || 0;
  
  await db.update(USER_TABLE).set({
    newPurchasedCredit: 20 + oldPurchasedCredit,
    totalCreditSize: 20 + oldTotalCreditSize,
    isMember: true,
    remainingCredits: 20 + newRemainCredit
  }).where(eq(USER_TABLE.email, customerEmail));
  
  // Add payment record
  await db.insert(PAYMENT_USER_TABLE).values({
    createdBy: customerEmail,
    transactionId: transactionId,
    amountPaid: data.object.amount_total,
    status: data.object.payment_status,
    creditAmount: 20,
    customerId: data.object.customer || 'guest_customer'
  });

          
        
    
        break;
        
      // Other event types...
    }
    
    return NextResponse.json({ success: true });
  }
  } catch (err) {

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

  
