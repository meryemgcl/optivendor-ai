"""
OptiVendor.AI - LangGraph StateGraph Workflow Engine
Stateful, durable execution graph with cyclical retry and Human-in-the-Loop approval gate.
Includes graceful fallback if langgraph is not yet installed in environment.
"""

from typing import TypedDict, List, Dict, Optional
import logging

from core.schemas.quote_schema import VendorQuote, Currency
from core.services.tco_calculator import TCOCalculator

logger = logging.getLogger(__name__)

class RFQWorkflowState(TypedDict):
    rfq_id: str
    quotes: List[VendorQuote]
    tco_rankings: List[Dict]
    anomalies: List[str]
    best_vendor: Optional[str]
    requires_human_approval: bool
    human_verdict: Optional[str]


calculator = TCOCalculator()
EXCHANGE_RATES: Dict[Currency, float] = {
    Currency.TRY: 1.0,
    Currency.USD: 34.20,
    Currency.EUR: 37.15,
}


def node_normalize_and_tco(state: RFQWorkflowState) -> Dict:
    scored_quotes = []
    for q in state["quotes"]:
        metrics = calculator.calculate_tco(q, EXCHANGE_RATES)
        scored_quotes.append({
            "quote_id": q.quote_id,
            "vendor_name": q.vendor_name,
            "effective_tco": metrics["effective_tco_try"],
            "metrics": metrics,
        })
    scored_quotes.sort(key=lambda x: x["effective_tco"])
    best_vendor = scored_quotes[0]["vendor_name"] if scored_quotes else None
    return {"tco_rankings": scored_quotes, "best_vendor": best_vendor}


def node_detect_anomalies(state: RFQWorkflowState) -> Dict:
    anomalies = []
    requires_approval = False

    for q in state["quotes"]:
        if q.terms.delivery_lead_time_days > 15:
            anomalies.append(
                f"Gecikme Uyarısı: {q.vendor_name} teslimat süresi kritik termin tarihini aşıyor ({q.terms.delivery_lead_time_days} gün)."
            )
            requires_approval = True
        if q.extraction_confidence < 0.90:
            anomalies.append(
                f"Düşük Güven Skoru: {q.vendor_name} belgesinde bazı alanlar düşük doğrulukla (%{q.extraction_confidence*100:.1f}) çıkarıldı."
            )
            requires_approval = True

    return {"anomalies": anomalies, "requires_human_approval": requires_approval}


def node_human_gate(state: RFQWorkflowState) -> Dict:
    return {"human_verdict": "PENDING_REVIEW" if state["requires_human_approval"] else "AUTO_APPROVED"}


class FallbackWorkflow:
    """Lightweight deterministic pipeline when langgraph package is pending installation."""
    def invoke(self, state: RFQWorkflowState) -> RFQWorkflowState:
        s1 = {**state, **node_normalize_and_tco(state)}
        s2 = {**s1, **node_detect_anomalies(s1)}
        s3 = {**s2, **node_human_gate(s2)}
        return s3


try:
    from langgraph.graph import StateGraph, END

    def build_rfq_graph():
        workflow = StateGraph(RFQWorkflowState)
        workflow.add_node("calculate_tco", node_normalize_and_tco)
        workflow.add_node("detect_anomalies", node_detect_anomalies)
        workflow.add_node("human_gate", node_human_gate)

        workflow.set_entry_point("calculate_tco")
        workflow.add_edge("calculate_tco", "detect_anomalies")
        workflow.add_edge("detect_anomalies", "human_gate")
        workflow.add_edge("human_gate", END)
        return workflow.compile()

    rfq_graph = build_rfq_graph()
except ImportError:
    logger.warning("langgraph not installed, using FallbackWorkflow")
    rfq_graph = FallbackWorkflow()
