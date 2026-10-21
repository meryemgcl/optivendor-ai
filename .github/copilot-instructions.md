# OptiVendor.AI - GitHub Copilot Custom Instructions

## Project Context
You are working on **OptiVendor.AI**, an enterprise-grade autonomous RFQ (Request for Quotation) normalization, supplier comparison, and procurement decision intelligence engine. The system extracts structured data from multi-format vendor proposals (scanned PDFs, images, Excel), calculates Total Cost of Ownership (TCO), visualizes bounding boxes over source documents (Visual Grounding), and provides Human-in-the-Loop decision workflows.

## Technology Stack & Constraints
- **Backend:** Python 3.11+, FastAPI, Pydantic v2 (strict validation), LangGraph (StateGraph), PostgreSQL with `AsyncPostgresSaver` / `pgvector`.
- **Frontend:** Next.js 14+ (App Router), TypeScript (strict mode, zero `any`), Tailwind CSS, shadcn/ui, Lucide Icons, Glassmorphism Dark Mode (`#090D16` palette).
- **AI / Multimodal:** Google Gemini 1.5 Pro / Claude 3.5 Sonnet multimodal APIs with strict structured JSON output enforcement.

## Architectural & Code Quality Principles
1. **Zero Hallucination Guarantee:** Never fabricate values. Missing data in quotes (e.g. unknown delivery dates) must remain `None`/`null`.
2. **Visual Grounding:** Every extracted line item must include normalized bounding box coordinates (`x_min`, `y_min`, `x_max`, `y_max` in 0.0 - 1.0 range) pointing to its source location in the document.
3. **Deterministic Routing over Pure LLM:** Use hardcoded Python validation (regex, math, schema validation) for calculations and critical thresholds. Use LLM strictly for unstructured extraction, anomaly interpretation, and counter-offer drafting.
4. **Human-in-the-Loop (HITL):** Never allow automatic database writes or email dispatch for quotes exceeding confidence thresholds or financial anomaly limits without explicit state interrupt (`interrupt()`).
5. **Code Style:**
   - Strict Python type hints on all functions and methods.
   - Comprehensive docstrings explaining arguments, returns, and domain rationale.
   - Clean Architecture: Decouple schemas (`core/schemas`), services (`core/services`), and workflow graphs (`core/agents`).
