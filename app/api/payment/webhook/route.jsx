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
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }
    
    const data = event.data;
    const eventType = event.type;
    
    console.log(`Processing webhook event: ${eventType}`);
    
    switch (eventType) {
      case 'checkout.session.completed':
        const transactionId = data.object.payment_intent || "no_payment_intent";
        const customerEmail = data.object.customer_details?.email;
        
        if (!customerEmail) {
          console.error("No customer email found in webhook data");
          return NextResponse.json({ error: "No customer email in webhook data" }, { status: 400 });
        }
        
        try {
          // Check if user exists
          const userDb = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, customerEmail));
          
          if (!userDb || userDb.length === 0) {
            console.log(`Test user ${customerEmail} not found. Creating temporary user for testing purposes.`);
            
            // Create a new user for testing purposes
            await db.insert(USER_TABLE).values({
              email: customerEmail,
              name: data.object.customer_details?.name || "Test User",
              newPurchasedCredit: 0,
              totalCreditSize: 0,
              remainingCredits: 0,
              isMember: false,
              // Add any other required fields with default values
            });
            
            // Re-fetch the newly created user
            const newUserDb = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, customerEmail));
            
            if (!newUserDb || newUserDb.length === 0) {
              throw new Error("Failed to create test user");
            }
            
            // Update the test user with credits
            await db.update(USER_TABLE).set({
              newPurchasedCredit: 20,
              totalCreditSize: 20,
              isMember: true,
              remainingCredits: 20
            }).where(eq(USER_TABLE.email, customerEmail));
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
          }
          
          // Add payment record
          await db.insert(PAYMENT_USER_TABLE).values({
            createdBy: customerEmail,
            transactionId: transactionId,
            amountPaid: data.object.amount_total / 100,
            status: data.object.payment_status,
            creditAmount: 20,
            customerId: data.object.customer || 'guest_customer' // Handle null customer
          });
          
          console.log(`Successfully processed payment for ${customerEmail}`);
        } catch (error) {
          console.error(`Database operation failed:`, error);
          return NextResponse.json({ error: "Database operation failed", details: error.message }, { status: 500 });
        }
        break;
        
      // Other event types...
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`Webhook handler error:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}