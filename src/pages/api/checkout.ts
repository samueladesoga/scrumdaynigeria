// Starts a Paystack payment for an attendee-count ticket.
//
// The browser only says which tier, how many attendees, and who's paying; the price is worked out
// here from src/content/ticket-tiers.yaml, so it can't be tampered with client-side. Responds with
// Paystack's hosted checkout URL for the browser to redirect to.
import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { PAYSTACK_SECRET_KEY } from 'astro:env/server';
import { z } from 'astro/zod';
import { quote } from '../../lib/ticket-pricing';

export const prerender = false;

const Body = z.object({
  tierId: z.string().min(1),
  quantity: z.number().int().min(1).max(1000),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  if (!PAYSTACK_SECRET_KEY) {
    console.error('[checkout] PAYSTACK_SECRET_KEY is not set');
    return json({ error: 'Online payment is temporarily unavailable. Please try again later.' }, 503);
  }

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return json({ error: 'Please enter your full name and a valid email address.' }, 400);
  }
  const { tierId, quantity, name, email } = parsed.data;

  const tier = await getEntry('ticketTiers', tierId);
  if (!tier?.data.bands) return json({ error: 'That ticket is not available.' }, 404);

  const price = quote(tier.data.bands, quantity);
  if (!price) {
    return json({ error: 'Groups this size are priced on request — please contact us.' }, 400);
  }

  const site = await getEntry('site', 'config');
  // e.g. "Scrum Day Nigeria 2027 Ticket - Group Booking". Shown on the Paystack receipt and in
  // the dashboard, so the buyer can tell what they paid for.
  const bandName = price.band.label.replace(/\b\w/g, (c) => c.toUpperCase());
  const ticketName = `${site!.data.eventName} Ticket - ${bandName}`;

  const origin = new URL(request.url).origin;
  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      amount: Math.round(price.total * 100), // kobo
      currency: tier.data.currency,
      callback_url: `${origin}/checkout/complete`,
      metadata: {
        tier: tierId,
        ticket: ticketName,
        quantity,
        unit_price: price.unitPrice,
        early_bird: price.earlyBird,
        cancel_action: `${origin}/#tickets`, // where Paystack's "Cancel payment" sends the buyer
        // Shown on the transaction in the Paystack dashboard.
        custom_fields: [
          { display_name: 'Buyer name', variable_name: 'buyer_name', value: name },
          { display_name: 'Ticket', variable_name: 'ticket', value: ticketName },
          { display_name: 'Attendees', variable_name: 'attendees', value: String(quantity) },
          { display_name: 'Price per person', variable_name: 'unit_price', value: String(price.unitPrice) },
        ],
      },
    }),
  }).catch((err) => {
    console.error('[checkout] Paystack request failed', err);
    return null;
  });

  const payload = await res?.json().catch(() => null);
  if (!res?.ok || !payload?.status || !payload.data?.authorization_url) {
    console.error('[checkout] Paystack initialize failed', res?.status, payload?.message);
    return json({ error: 'We could not start the payment. Please try again in a moment.' }, 502);
  }

  return json({ url: payload.data.authorization_url });
};
