"""
OptiVendor.AI - FastAPI Backend Server
Provides REST endpoints for RFQ document parsing, TCO calculation,
anomaly detection, and negotiation email generation.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import uuid
import datetime

from core.schemas.quote_schema import (
    VendorQuote,
    QuoteLineItem,
    CommercialTerms,
    Currency,
    BoundingBox,
)
from core.services.tco_calculator import TCOCalculator
from core.agents.rfq_workflow import rfq_graph, RFQWorkflowState

app = FastAPI(
    title="OptiVendor.AI API Engine",
    description="Autonomous RFQ Normalization, Visual Grounding & TCO Intelligence API",
    version="0.1.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

calculator = TCOCalculator(
    monthly_interest_rate=0.035,
    daily_delay_risk_penalty=250.0,
    target_delivery_deadline_days=14,
)

EXCHANGE_RATES: Dict[Currency, float] = {
    Currency.TRY: 1.0,
    Currency.USD: 34.20,
    Currency.EUR: 37.15,
    Currency.GBP: 44.50,
}


class TCORankingRequest(BaseModel):
    quotes: List[VendorQuote]


class TCORankingResponse(BaseModel):
    ranked_quotes: List[Dict]
    best_tco_vendor: str
    summary: str


class NegotiationRequest(BaseModel):
    target_vendor: VendorQuote
    competing_quotes: List[VendorQuote]
    target_discount_pct: float = Field(default=8.0, ge=1.0, le=50.0)


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "OptiVendor.AI Backend Engine",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "version": "0.1.0",
    }


@app.get("/api/quotes/demo", response_model=List[VendorQuote], tags=["Demo"])
def get_demo_quotes():
    """Returns 3 normalized demo quotes with bounding box grounding metadata."""
    return [
        VendorQuote(
            quote_id="Q-001",
            vendor_name="MetalSan Endüstriyel A.Ş.",
            tax_number="6180329910",
            quote_date=datetime.date(2026, 10, 15),
            currency=Currency.TRY,
            items=[
                QuoteLineItem(
                    item_code="FLG-304-DN50",
                    description="DN50 PN16 Paslanmaz Çelik Flanş (AISI 304)",
                    quantity=120,
                    unit="Adet",
                    unit_price=450.0,
                    vat_rate=20.0,
                    currency=Currency.TRY,
                    bounding_box=BoundingBox(page_number=1, x_min=0.12, y_min=0.34, x_max=0.88, y_max=0.39),
                ),
                QuoteLineItem(
                    item_code="VLV-BALL-2IN",
                    description="2 inç 3 Yollu Küresel Vana Paslanmaz",
                    quantity=45,
                    unit="Adet",
                    unit_price=1250.0,
                    vat_rate=20.0,
                    currency=Currency.TRY,
                    bounding_box=BoundingBox(page_number=1, x_min=0.12, y_min=0.40, x_max=0.88, y_max=0.45),
                ),
            ],
            terms=CommercialTerms(
                payment_terms_days=30,
                delivery_lead_time_days=10,
                shipping_included=True,
                validity_days=15,
                special_notes="Fiyatlarımıza şantiye teslim nakliye dahildir.",
            ),
            extraction_confidence=0.98,
        ),
        VendorQuote(
            quote_id="Q-002",
            vendor_name="EndüstriTek Metal San. Tic.",
            tax_number="3329014421",
            quote_date=datetime.date(2026, 10, 16),
            currency=Currency.TRY,
            items=[
                QuoteLineItem(
                    item_code="FLG-304-DN50",
                    description="DN50 PN16 Paslanmaz Çelik Flanş (AISI 304)",
                    quantity=120,
                    unit="Adet",
                    unit_price=410.0,
                    vat_rate=20.0,
                    currency=Currency.TRY,
                    bounding_box=BoundingBox(page_number=1, x_min=0.15, y_min=0.32, x_max=0.85, y_max=0.37),
                ),
                QuoteLineItem(
                    item_code="VLV-BALL-2IN",
                    description="2 inç 3 Yollu Küresel Vana Paslanmaz",
                    quantity=45,
                    unit="Adet",
                    unit_price=1320.0,
                    vat_rate=20.0,
                    currency=Currency.TRY,
                    bounding_box=BoundingBox(page_number=1, x_min=0.15, y_min=0.38, x_max=0.85, y_max=0.43),
                ),
            ],
            terms=CommercialTerms(
                payment_terms_days=90,  # 90 Days financing advantage
                delivery_lead_time_days=18,  # Slightly delayed
                shipping_included=True,
                validity_days=30,
                special_notes="90 gün vadeli çek kabul edilmektedir.",
            ),
            extraction_confidence=0.95,
        ),
        VendorQuote(
            quote_id="Q-003",
            vendor_name="ÇelikAŞ Boru ve Ek Parçaları",
            tax_number="1290348820",
            quote_date=datetime.date(2026, 10, 17),
            currency=Currency.TRY,
            items=[
                QuoteLineItem(
                    item_code="FLG-304-DN50",
                    description="DN50 PN16 Paslanmaz Çelik Flanş (AISI 304)",
                    quantity=120,
                    unit="Adet",
                    unit_price=475.0,
                    vat_rate=20.0,
                    currency=Currency.TRY,
                    bounding_box=BoundingBox(page_number=1, x_min=0.10, y_min=0.30, x_max=0.90, y_max=0.35),
                ),
                QuoteLineItem(
                    item_code="VLV-BALL-2IN",
                    description="2 inç 3 Yollu Küresel Vana Paslanmaz",
                    quantity=45,
                    unit="Adet",
                    unit_price=1180.0,
                    vat_rate=20.0,
                    currency=Currency.TRY,
                    bounding_box=BoundingBox(page_number=1, x_min=0.10, y_min=0.36, x_max=0.90, y_max=0.41),
                ),
            ],
            terms=CommercialTerms(
                payment_terms_days=0,  # Cash in advance
                delivery_lead_time_days=5,  # Fastest delivery
                shipping_included=False,  # Excludes shipping
                validity_days=10,
                special_notes="Peşin ödemede 5 gün içinde derhal sevk.",
            ),
            extraction_confidence=0.92,
        ),
    ]


@app.post("/api/quotes/calculate-tco", response_model=TCORankingResponse, tags=["Intelligence"])
def calculate_tco_rankings(req: TCORankingRequest):
    """Computes exact TCO, factoring in payment term financing and delivery risk penalties."""
    if not req.quotes:
        raise HTTPException(status_code=400, detail="At least one quote must be provided.")

    scored_list = []
    for q in req.quotes:
        tco_metrics = calculator.calculate_tco(q, EXCHANGE_RATES)
        scored_list.append(
            {
                "quote_id": q.quote_id,
                "vendor_name": q.vendor_name,
                "currency": q.currency,
                "grand_total_net": q.grand_total_net,
                "grand_total_gross": q.grand_total_gross,
                "payment_terms_days": q.terms.payment_terms_days,
                "delivery_lead_time_days": q.terms.delivery_lead_time_days,
                "metrics": tco_metrics,
            }
        )

    # Sort by effective TCO ascending (lowest effective cost first)
    scored_list.sort(key=lambda x: x["metrics"]["effective_tco_try"])
    best_vendor = scored_list[0]["vendor_name"]

    summary_text = (
        f"En avantajlı teklif: {best_vendor} (Efektif TCO: {scored_list[0]['metrics']['effective_tco_try']:,.2f} TL). "
        f"Vade avantajı ve termin riski dengesi optimize edilmiştir."
    )

    return TCORankingResponse(
        ranked_quotes=scored_list,
        best_tco_vendor=best_vendor,
        summary=summary_text,
    )


@app.post("/api/quotes/negotiate", tags=["Intelligence"])
def generate_negotiation_letter(req: NegotiationRequest):
    """Generates a professional B2B counter-offer letter for procurement negotiations."""
    vendor = req.target_vendor
    target_price = round(vendor.grand_total_net * (1 - req.target_discount_pct / 100), 2)

    letter_tr = f"""Sayın {vendor.vendor_name} Satış Direktörlüğü,

Şirketimize iletmiş olduğunuz {vendor.quote_id} numaralı teklifinizi teknik ve ticari açıdan detaylı olarak inceledik. Teknik yeterliliğiniz ve ürün spesifikasyonlarınız tarafımızca onaylanmıştır.

Ancak yürütülen ihale sürecimizde alternatif tedarikçilerden aldığımız vadeli ve rekabetçi teklifler neticesinde, teklifinizin bütçe hedeflerimizin yaklaşık %{req.target_discount_pct} üzerinde kaldığını tespit ettik.

Sipariş onayımızı firmanıza verebilmemiz adına:
1. Toplam bedelin net {target_price:,.2f} {vendor.currency.value} olarak güncellenmesini,
2. Veya mevcut fiyatın korunması durumunda ödeme vadesinin {max(vendor.terms.payment_terms_days, 60)} gün olarak revize edilmesini talep ediyoruz.

Şartların uygun görülmesi halinde sipariş mektubumuz gün içerisinde tarafınıza iletilecektir.

Saygılarımızla,
Satın Alma ve Tedarik Zinciri Direktörlüğü
"""

    return {
        "vendor_name": vendor.vendor_name,
        "target_discount_pct": req.target_discount_pct,
        "target_net_price": target_price,
        "negotiation_letter_tr": letter_tr,
    }


@app.post("/api/workflow/run", tags=["Agent Workflow"])
def run_agentic_rfq_workflow(quotes: List[VendorQuote]):
    """Executes the full LangGraph RFQ evaluation, anomaly detection, and HITL gate."""
    initial_state: RFQWorkflowState = {
        "rfq_id": f"RFQ-{uuid.uuid4().hex[:8].upper()}",
        "quotes": quotes,
        "tco_rankings": [],
        "anomalies": [],
        "best_vendor": None,
        "requires_human_approval": False,
        "human_verdict": None,
    }
    result = rfq_graph.invoke(initial_state)
    return result

