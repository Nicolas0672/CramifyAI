// File: pages/api/webhook.js
import { db } from "@/configs/db";
import { PAYMENT_USER_TABLE, USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

// This config is critical - it disables body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Get the raw body for signature verification
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const rawBody = Buffer.concat(chunks).toString('utf8');
    
    const signature = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEB_HOOK_KEY;
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).json({ error: "Webhook signature verification failed" });
    }
    
    const data = event.data;
    const eventType = event.type;
    
    console.log(`Processing webhook event: ${eventType}`);
    
    if (eventType === 'checkout.session.completed') {
      const transactionId = data.object.payment_intent || "no_payment_intent";
      const customerEmail = data.object.customer_details?.email;
      
      console.log(`Processing checkout completion for email: ${customerEmail}`);
      
      if (!customerEmail) {
        console.error("No customer email in webhook data");
        return res.status(400).json({ error: "No customer email in webhook data" });
      }
      
      // Check if user exists
      const userDb = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, customerEmail));
      
      if (!userDb || userDb.length === 0) {
        console.error(`User with email ${customerEmail} not found`);
        return res.status(400).json({ error: "User not found" });
      }
      
      try {
        // Update existing user
        const oldPurchasedCredit = userDb[0].newPurchasedCredit || 0;
        const oldTotalCreditSize = userDb[0].totalCreditSize || 0;
        const newRemainCredit = userDb[0].remainingCredits || 0;
        
        console.log(`Updating user credits: ${oldPurchasedCredit} -> ${oldPurchasedCredit + 20}`);
        
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
          amountPaid: data.object.amount_total, // Convert from cents
          status: data.object.payment_status,
          creditAmount: 20,
          customerId: data.object.customer || 'guest_customer'
        });
        
        console.log("User and payment records updated successfully");
        return res.status(200).json({ success: true });
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
        return res.status(500).json({ error: dbError.message });
      }
    }
    
    // Return a response for other event types
    return res.status(200).json({ received: true });
    
  } catch (err) {
    console.error("Webhook processing error:", err);
    return res.status(500).json({ error: err.message });
  }
}