# 🤖 OptiVendor.AI - GitHub Copilot Master Development Playbook

> **Target Environment:** VS Code / Cursor with GitHub Copilot Chat & Copilot Edits  
> **Workspace Context:** `OptiVendor-AI`  
> **Language:** English (Prompts & Technical Contracts)  
> **Version:** 1.0.0

This document contains the complete, sequential, step-by-step English prompt playbook designed specifically for GitHub Copilot. It allows you to build, test, and optimize the entire **OptiVendor.AI** procurement decision platform from Phase 1 through Phase 4 with senior software engineering standards.

---

## 🧭 How to Use This Playbook with Copilot

1. **Workspace Context:** Ensure the `.github/copilot-instructions.md` file is present in your repo. Copilot automatically loads it for global context.
2. **File References:** Use `#file` tags (e.g., `#file:quote_schema.py`) in Copilot Chat to supply immediate context.
3. **Execution Order:** Execute the prompts sequentially. Validate outputs with `/tests` before proceeding to the next prompt.

---

## 🎨 Phase 1: Frontend Architecture & Visual Grounding UI

### Prompt 1.1: Next.js 14 Glassmorphic Layout & Shell
> **Target:** In Copilot Chat, reference `@workspace`

```text
Act as a Principal Frontend Architect. In the `web` folder, scaffold the Next.js 14 App Router layout for OptiVendor.AI.

Requirements:
1. Tech Stack: Next.js 14 (App Router), TypeScript (strict mode, zero `any`), Tailwind CSS, lucide-react, and shadcn/ui.
2. Design System:
   - Ultra-modern Glassmorphic Dark Mode with background `#090D16`.
   - Card surfaces with `bg-slate-900/60 backdrop-blur-md border border-blue-500/15`.
   - Typography: 'Inter' for UI, 'JetBrains Mono' for numbers, monetary values, and codes.
3. Layout Structure:
   - `<Header />`: Displays the SVG logo from `/assets/logo.svg`, an "AGENT ACTIVE" status pill with a pulsating emerald green indicator (#10B981), and a workspace dropdown selector.
   - `<SplitViewContainer />`: 50/50 responsive split screen:
     * Left Column: Document Canvas & Visual Grounding Viewer.
     * Right Column: RFQ Comparison Matrix, TCO Summary Cards, and Action Drawer.
4. Provide clean, modular code with complete TypeScript interfaces in `web/components/layout/`.
```

---

### Prompt 1.2: Visual Grounding Interactive Document Viewer
> **Target:** Reference `#file:quote_schema.py`

```text
Create `web/components/viewer/VisualGroundingViewer.tsx` to render multi-page vendor quote documents and display interactive bounding boxes.

Requirements:
1. Accept props:
   - `documentUrl: string`
   - `activeBox: BoundingBox | null` (where BoundingBox has page_number, x_min, y_min, x_max, y_max normalized between 0.0 and 1.0)
   - `onBoxClick?: (box: BoundingBox) => void`
2. Capabilities:
   - Render document preview (using HTML5 Canvas or SVG overlay).
   - When an active box is provided:
     * Calculate absolute pixel coordinates from normalized values.
     * Render a glowing bounding box with `rgba(250, 204, 21, 0.25)` fill and `border: 2px solid #FACC15` with a subtle box-shadow pulse (`shadow-[0_0_15px_rgba(250,204,21,0.6)]`).
     * Display a floating badge showing "Confidence: 98.2% (Gemini 1.5 Pro)".
     * Automatically smooth-scroll the canvas container to center the active bounding box.
3. Add zoom controls (+ / - / fit-to-width) with smooth CSS transitions.
```

---

### Prompt 1.3: Interactive RFQ Comparison Matrix & Action Cards
> **Target:** Reference `#file:quote_schema.py` and `#file:tco_calculator.py`

```text
Create `web/components/matrix/RFQComparisonMatrix.tsx` for senior procurement managers.

Requirements:
1. Top Section - 3 Decision Cards:
   - "Lowest Raw Price": Green badge, highlighting vendor with minimal unit cost.
   - "Fastest Delivery": Blue badge, showing quickest turnaround in days.
   - "Recommended TCO Choice": Golden border card showing optimal choice after factoring in 90-day payment term savings and low delay penalty.
2. Comparison Table:
   - Columns: Item Code, Description, Quantity, Supplier A Price, Supplier B Price, Supplier C Price, Variance %, Status.
   - Hovering or clicking on any price cell must trigger `onSelectLineItem(item)` which sends the item's `bounding_box` to the `VisualGroundingViewer`.
3. Action Drawer:
   - Button 1: "Export Normalized Excel" (with loading state).
   - Button 2: "Generate Counter-Offer Email" (opens modal with AI-generated draft).
```

---

## ⚙️ Phase 2: Multimodal Extraction & LangGraph Engine

### Prompt 2.1: Multimodal Document Extraction Service (Gemini 1.5 Pro / Claude 3.5 Sonnet)
> **Target:** Reference `#file:quote_schema.py`

```text
Act as a Senior AI Infrastructure Engineer. In `core/services/document_extractor.py`, implement `MultimodalQuoteExtractor`.

Requirements:
1. Use the official `google-genai` SDK or `anthropic` SDK with native multimodal capabilities.
2. Accept document bytes (PDF or high-res image) and return an instance of `VendorQuote` strictly validated with Pydantic.
3. System Prompt Constraints:
   - Zero-hallucination policy: Extract strictly what is explicitly printed. Missing terms must be `None`.
   - Calculate bounding boxes (`x_min`, `y_min`, `x_max`, `y_max` normalized 0.0 - 1.0) for every line item's price and description.
   - Automatically normalize currency strings ("$", "€", "TL", "TRY") to the `Currency` enum.
4. Implement retry with exponential backoff for rate-limit (429) errors.
5. Provide comprehensive error logging and fallbacks if Pydantic validation fails.
```

---

### Prompt 2.2: LangGraph StateGraph Workflow with Human-in-the-Loop Checkpoints
> **Target:** Reference `#file:quote_schema.py` and `#file:tco_calculator.py`

```text
Implement `core/agents/rfq_workflow.py` using `langgraph` and `pydantic`.

Requirements:
1. Define the Graph State Schema (`RFQWorkflowState` TypedDict):
   - `rfq_id: str`
   - `document_paths: List[str]`
   - `extracted_quotes: List[VendorQuote]`
   - `tco_results: Dict[str, Dict[str, float]]`
   - `anomalies_detected: List[str]`
   - `requires_human_approval: bool`
   - `human_verdict: Optional[str]`
2. Implement Nodes:
   - `node_ingest_and_parse`: Iterates through uploaded documents and populates `extracted_quotes`.
   - `node_calculate_tco`: Calls `TCOCalculator` for all quotes using simulated TCMB FX rates.
   - `node_evaluate_anomalies`: Flags price deviations > 15% compared to historical baselines.
   - `node_human_gate`: If `requires_human_approval` is True or extraction confidence < 0.85, invoke LangGraph's `interrupt()` primitive to freeze execution.
3. Persistence:
   - Configure graph compilation with `PostgresSaver` / `AsyncPostgresSaver` for durable checkpoints.
4. Add execution harness with resume support: `resume_rfq_workflow(thread_id, approval_decision)`.
```

---

## 💡 Phase 2B: Anomaly Detection & Strategic Negotiation Engine

### Prompt 2.3: Historical Price Drift & Anomaly Detector
> **Target:** Reference `#file:quote_schema.py`

```text
Create `core/services/anomaly_detector.py` to identify supplier price inflation and contract risks.

Requirements:
1. Implement class `ProcurementAnomalyDetector`:
   - Inputs: Current `VendorQuote` and a list of historical purchase orders for the same SKU/items.
2. Checks to perform:
   - Unit Price Drift: Flags any SKU priced > 12% above 6-month historical moving average.
   - Payment Term Surcharge: Detects whether the vendor added an implicit financing fee (> 4% monthly) compared to their cash price.
   - Lead Time Risk: Flags vendors whose delivery date exceeds the production milestone deadline.
3. Output: Return a structured `List[AnomalyAlert]` with severity levels (`LOW`, `MEDIUM`, `CRITICAL`) and executive summary text ready for UI rendering.
```

---

### Prompt 2.4: Strategic B2B Counter-Offer & Negotiation Draft Generator
> **Target:** Reference `#file:quote_schema.py`

```text
Create `core/services/negotiation_generator.py` to craft strategic procurement counter-proposals.

Requirements:
1. Implement `generate_counter_offer(target_quote: VendorQuote, competing_quotes: List[VendorQuote], target_savings_pct: float = 8.0) -> str`.
2. Tone & Strategy:
   - Executive, respectful, partnership-oriented, yet unyielding on commercial discipline.
   - Never disclose competitor names; refer only to "validated competitive proposals in our active tender cycle."
   - Strategic Trade-offs: If unit price cannot be reduced, propose extending payment terms from 30 to 60 days or waiving freight charges.
   - Provide output in bilingual format: Turkish and English.
```

---

## 🧪 Phase 3: Testing, Synthetic Datasets & Benchmarks

### Prompt 3.1: Synthetic Multi-Sector RFQ Dataset Generator
> **Target:** In Copilot Chat

```text
Create `tests/generators/synthetic_rfq_generator.py` to produce realistic vendor quotes for stress-testing.

Generate 5 distinct test scenarios:
1. Clean Industrial PDF: Standard machining parts (bolts, flanges), 20% VAT, 30 days maturity, TRY.
2. Currency & Cross-Border Quote: Raw materials in EUR with Incoterms DAP, 60 days maturity.
3. Messy / Noisy Scanned Document: Simulates OCR defects, uneven spacing, handwritten notes.
4. Tiered Pricing / Volume Discount: "1-100 units: $45, 101-500 units: $38, cash payment extra 4% discount".
5. Edge Case / Missing Metadata: Missing currency sign, vague delivery terms ("subject to warehouse stock").

Output both raw synthetic text and expected Ground-Truth Pydantic JSON for automated regression testing.
```

---

### Prompt 3.2: Pytest Automated Extraction & Benchmark Suite
> **Target:** Reference `#file:document_extractor.py` and `#file:synthetic_rfq_generator.py`

```text
Create `tests/test_extraction_benchmark.py` using `pytest` and `pytest-asyncio`.

Requirements:
1. Evaluate extracted `VendorQuote` against ground-truth datasets:
   - Unit Price Extraction Accuracy (Tolerance: ±0.01)
   - Quantity Match (Exact integer/float match)
   - Payment Maturity Accuracy (Day count match)
   - Overall Extraction F1-Score
2. Assert that price extraction accuracy exceeds 99.0% on clean documents and 94.0% on noisy documents.
3. Print an ASCII benchmark summary table displaying execution latency, token count, and accuracy per vendor document.
```

---

## 📦 Phase 4: Production Readiness & Machine Handoff Archive

### Prompt 4.1: Production Docker & Multi-Service Setup
> **Target:** In Copilot Chat

```text
Create production containerization files for OptiVendor.AI:
1. `docker-compose.prod.yml`:
   - `web`: Next.js 14 standalone container.
   - `api`: FastAPI Python 3.11 backend with multi-worker Uvicorn.
   - `postgres`: PostgreSQL 16 with `pgvector` extension enabled.
   - `redis`: For caching repetitive extraction hashes.
2. Secure environment template `.env.production.example`.
3. Health check endpoints (`/healthz`) testing database connectivity and LLM API reachability.
```

---

### Prompt 4.2: Automated Machine-Readable Archive (`SYSTEM_STATE.md`)
> **Target:** Reference `@workspace`

```text
Generate a comprehensive, single-file machine-readable archive named `SYSTEM_STATE.md` in the project root.

Structure:
1. System Overview & Active Version
2. Component Inventory & Status Matrix
3. Complete Pydantic Schema Contracts (Raw Python code)
4. LangGraph Graph Topology & State Transitions
5. Environment Variables & Secret Specifications
6. AI-to-AI Handoff Instructions for the next Copilot or developer session.
```

---

## ⚡ GitHub Copilot Power Commands Cheat Sheet

| Command / Syntax | Usage in OptiVendor.AI |
| :--- | :--- |
| `@workspace #file:quote_schema.py explain how TCO is calculated` | Summarizes domain logic across the codebase. |
| `/tests #file:tco_calculator.py` | Auto-generates exhaustive edge-case unit tests. |
| `/fix in visual grounding canvas` | Automatically debugs SVG coordinate transformation errors. |
| `@workspace /new Next.js split view component` | Scaffolds matching frontend components using existing design tokens. |
