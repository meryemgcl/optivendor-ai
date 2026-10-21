"""
OptiVendor.AI - TCO (Total Cost of Ownership) Calculator
Computes effective cost by balancing raw price, financing costs (payment terms),
and delivery risk penalties.
"""

from typing import Dict
from core.schemas.quote_schema import VendorQuote, Currency


class TCOCalculator:
    def __init__(
        self,
        monthly_interest_rate: float = 0.035,  # 3.5% monthly commercial interest / opportunity cost
        daily_delay_risk_penalty: float = 250.0,  # Estimated risk penalty per day exceeding deadline
        target_delivery_deadline_days: int = 14,
    ):
        self.daily_interest_rate = monthly_interest_rate / 30.0
        self.daily_delay_risk_penalty = daily_delay_risk_penalty
        self.target_deadline = target_delivery_deadline_days

    def calculate_tco(self, quote: VendorQuote, exchange_rates_to_try: Dict[Currency, float]) -> Dict[str, float]:
        """
        Calculates TCO in TRY equivalent.
        Formula:
        Net TRY Price - Financing Value (longer payment terms save cash) + Delay Penalty
        """
        rate = exchange_rates_to_try.get(quote.currency, 1.0)
        net_base_try = quote.grand_total_net * rate

        # Financing advantage: 90 days delay allows capital to earn interest or avoid loan interest
        financing_advantage = net_base_try * (quote.terms.payment_terms_days * self.daily_interest_rate)

        # Delay penalty if delivery exceeds target deadline
        delay_days = max(0, quote.terms.delivery_lead_time_days - self.target_deadline)
        delay_penalty = delay_days * self.daily_delay_risk_penalty

        # Shipping penalty if excluded (estimated flat logistics surcharge)
        shipping_penalty = 0.0 if quote.terms.shipping_included else (net_base_try * 0.03)

        effective_tco = net_base_try - financing_advantage + delay_penalty + shipping_penalty

        return {
            "net_base_try": round(net_base_try, 2),
            "financing_advantage_try": round(financing_advantage, 2),
            "delay_penalty_try": round(delay_penalty, 2),
            "shipping_penalty_try": round(shipping_penalty, 2),
            "effective_tco_try": round(effective_tco, 2),
        }
