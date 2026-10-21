"""
OptiVendor.AI - Unit & Integration Test Suite
Verifies Pydantic schema validation, TCO math calculations, and FastAPI endpoints.
"""

import unittest
from datetime import date
from fastapi.testclient import TestClient

from core.main import app
from core.schemas.quote_schema import VendorQuote, QuoteLineItem, CommercialTerms, Currency, BoundingBox
from core.services.tco_calculator import TCOCalculator


class TestOptiVendorCore(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.calculator = TCOCalculator(
            monthly_interest_rate=0.035,
            daily_delay_risk_penalty=250.0,
            target_delivery_deadline_days=14,
        )

    def test_health_endpoint(self):
        """Test healthcheck responds with 200 OK."""
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")

    def test_demo_quotes_endpoint(self):
        """Verify demo quotes API returns 3 grounded proposals."""
        response = self.client.get("/api/quotes/demo")
        self.assertEqual(response.status_code, 200)
        quotes = response.json()
        self.assertEqual(len(quotes), 3)
        self.assertEqual(quotes[0]["currency"], "TRY")
        self.assertIn("bounding_box", quotes[0]["items"][0])

    def test_tco_calculation_math(self):
        """Verify financing advantage of 90-day payment term vs cash in advance."""
        cash_quote = VendorQuote(
            quote_id="Q-TEST-CASH",
            vendor_name="Cash Vendor",
            currency=Currency.TRY,
            items=[QuoteLineItem(description="Flange", quantity=100, unit_price=100.0)],
            terms=CommercialTerms(payment_terms_days=0, delivery_lead_time_days=10),
        )
        deferred_quote = VendorQuote(
            quote_id="Q-TEST-TERM",
            vendor_name="Deferred Vendor",
            currency=Currency.TRY,
            items=[QuoteLineItem(description="Flange", quantity=100, unit_price=100.0)],
            terms=CommercialTerms(payment_terms_days=90, delivery_lead_time_days=10),
        )

        rates = {Currency.TRY: 1.0}
        cash_tco = self.calculator.calculate_tco(cash_quote, rates)
        deferred_tco = self.calculator.calculate_tco(deferred_quote, rates)

        # 90-day term should yield positive financing advantage, lowering effective TCO
        self.assertEqual(cash_tco["financing_advantage_try"], 0.0)
        self.assertGreater(deferred_tco["financing_advantage_try"], 0.0)
        self.assertLess(deferred_tco["effective_tco_try"], cash_tco["effective_tco_try"])

    def test_workflow_run_endpoint(self):
        """Test LangGraph workflow endpoint evaluates quotes and identifies best vendor."""
        demo_resp = self.client.get("/api/quotes/demo")
        quotes = demo_resp.json()

        workflow_resp = self.client.post("/api/workflow/run", json=quotes)
        self.assertEqual(workflow_resp.status_code, 200)
        result = workflow_resp.json()
        self.assertIn("tco_rankings", result)
        self.assertIn("anomalies", result)
        self.assertIsNotNone(result["best_vendor"])


if __name__ == "__main__":
    unittest.main()
