"""
OptiVendor.AI - Core Pydantic Data Contracts
Clean architecture, strict types, zero-hallucination validation.
"""

from datetime import date
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class Currency(str, Enum):
    TRY = "TRY"
    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"


class BoundingBox(BaseModel):
    page_number: int = Field(default=1, description="1-based page number")
    x_min: float = Field(..., ge=0.0, le=1.0, description="Normalized top-left X coordinate")
    y_min: float = Field(..., ge=0.0, le=1.0, description="Normalized top-left Y coordinate")
    x_max: float = Field(..., ge=0.0, le=1.0, description="Normalized bottom-right X coordinate")
    y_max: float = Field(..., ge=0.0, le=1.0, description="Normalized bottom-right Y coordinate")


class QuoteLineItem(BaseModel):
    item_code: Optional[str] = Field(default=None, description="SKU or supplier part number")
    description: str = Field(..., description="Detailed description of goods or services")
    quantity: float = Field(..., gt=0, description="Quantity offered")
    unit: str = Field(default="Adet", description="Unit of measurement (Adet, Kg, Mt, etc.)")
    unit_price: float = Field(..., ge=0, description="Price per unit excluding taxes")
    vat_rate: float = Field(default=20.0, description="Value Added Tax percentage")
    currency: Currency = Field(default=Currency.TRY, description="Item currency")
    bounding_box: Optional[BoundingBox] = Field(default=None, description="Visual location in source document")

    @property
    def total_net_price(self) -> float:
        return round(self.quantity * self.unit_price, 2)

    @property
    def total_gross_price(self) -> float:
        return round(self.total_net_price * (1 + self.vat_rate / 100), 2)


class CommercialTerms(BaseModel):
    payment_terms_days: int = Field(default=0, ge=0, description="Payment maturity in calendar days (0 = Cash)")
    delivery_lead_time_days: int = Field(default=7, ge=0, description="Delivery lead time in business days")
    shipping_included: bool = Field(default=True, description="Freight & logistics included in price")
    validity_days: int = Field(default=15, description="Validity period of quote in days")
    special_notes: Optional[str] = Field(default=None, description="Discounts, warranties or remarks")


class VendorQuote(BaseModel):
    quote_id: str = Field(..., description="Unique generated quote identifier")
    vendor_name: str = Field(..., description="Legal company name of vendor")
    tax_number: Optional[str] = Field(default=None, description="Tax ID or registration number")
    quote_date: Optional[date] = Field(default=None, description="Date quote was issued")
    currency: Currency = Field(default=Currency.TRY, description="Primary currency")
    items: List[QuoteLineItem] = Field(default_factory=list, description="List of offered items")
    terms: CommercialTerms = Field(default_factory=CommercialTerms, description="Payment and delivery conditions")
    extraction_confidence: float = Field(default=1.0, ge=0.0, le=1.0, description="LLM extraction confidence")

    @property
    def grand_total_net(self) -> float:
        return round(sum(item.total_net_price for item in self.items), 2)

    @property
    def grand_total_gross(self) -> float:
        return round(sum(item.total_gross_price for item in self.items), 2)
