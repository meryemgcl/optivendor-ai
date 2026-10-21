/**
 * OptiVendor.AI - API Client
 * Facilitates typed communication between Next.js frontend and FastAPI backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface ApiHealth {
  status: string;
  service: string;
  timestamp: string;
  version: string;
}

export async function fetchHealth(): Promise<ApiHealth> {
  const res = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Healthcheck failed: ${res.statusText}`);
  return res.json();
}

export async function fetchDemoQuotes(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/api/quotes/demo`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch demo quotes: ${res.statusText}`);
  return res.json();
}

export async function postCalculateTco(quotes: any[]): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/quotes/calculate-tco`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quotes }),
  });
  if (!res.ok) throw new Error(`TCO calculation failed: ${res.statusText}`);
  return res.json();
}

export async function postNegotiate(
  targetVendor: any,
  competingQuotes: any[],
  targetDiscountPct: number = 8.0,
): Promise<{ negotiation_letter_tr: string; target_net_price: number }> {
  const res = await fetch(`${API_BASE_URL}/api/quotes/negotiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      target_vendor: targetVendor,
      competing_quotes: competingQuotes,
      target_discount_pct: targetDiscountPct,
    }),
  });
  if (!res.ok) throw new Error(`Negotiation generation failed: ${res.statusText}`);
  return res.json();
}
