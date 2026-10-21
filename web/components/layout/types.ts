export interface Workspace {
  id: string;
  name: string;
  description: string;
}

export interface HeaderProps {
  workspaces?: Workspace[];
  activeWorkspaceId?: string;
  onWorkspaceChange?: (workspace: Workspace) => void;
}

export interface BoundingBox {
  pageNumber: number;
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

export interface Supplier {
  id: string;
  name: string;
  initials: string;
  color: "blue" | "violet" | "emerald";
  documentName: string;
}

export interface QuoteLineItem {
  id: string;
  code: string;
  description: string;
  quantity: number;
  unit: string;
  prices: Record<string, number>;
  variance: number;
  status: "verified" | "review";
  boundingBox: BoundingBox;
}

export interface TcoMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  accent: "emerald" | "blue" | "amber";
  iconLabel: string;
}

export interface DocumentCanvasProps {
  suppliers: Supplier[];
  activeSupplierId: string;
  activeBoundingBox: BoundingBox;
  onSupplierChange: (supplierId: string) => void;
}

export interface RfqComparisonProps {
  suppliers: Supplier[];
  lineItems: QuoteLineItem[];
  activeLineItemId: string;
  onSelectLineItem: (lineItem: QuoteLineItem) => void;
}

export interface TcoSummaryCardsProps {
  metrics: TcoMetric[];
}

export interface ActionDrawerProps {
  onExport: () => void;
  counterOfferDraft: string;
}

export interface SplitViewContainerProps {
  className?: string;
}
