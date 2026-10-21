import type {
  QuoteLineItem,
  Supplier,
  TcoMetric,
  Workspace,
} from "@/components/layout/types";

export const workspaces: Workspace[] = [
  {
    id: "northstar",
    name: "Northstar Manufacturing",
    description: "Procurement workspace",
  },
  {
    id: "apex",
    name: "Apex Components",
    description: "Shared workspace",
  },
  {
    id: "meridian",
    name: "Meridian Projects",
    description: "Operations workspace",
  },
];

export const suppliers: Supplier[] = [
  {
    id: "atlas",
    name: "Atlas Industrial",
    initials: "AI",
    color: "blue",
    documentName: "Atlas_Industrial_Quote.pdf",
  },
  {
    id: "meridian-supply",
    name: "Meridian Supply",
    initials: "MS",
    color: "violet",
    documentName: "Meridian_Supply_Quote.pdf",
  },
  {
    id: "vertex",
    name: "Vertex Systems",
    initials: "VS",
    color: "emerald",
    documentName: "Vertex_Systems_Quote.pdf",
  },
];

export const lineItems: QuoteLineItem[] = [
  {
    id: "servo-motor",
    code: "SM-2400",
    description: "Servo motor assembly",
    quantity: 24,
    unit: "units",
    prices: {
      atlas: 428.5,
      "meridian-supply": 462,
      vertex: 439,
    },
    variance: 7.8,
    status: "verified",
    boundingBox: {
      pageNumber: 1,
      xMin: 0.12,
      yMin: 0.36,
      xMax: 0.88,
      yMax: 0.405,
    },
  },
  {
    id: "drive-controller",
    code: "DC-1180",
    description: "Variable drive controller",
    quantity: 12,
    unit: "units",
    prices: {
      atlas: 785,
      "meridian-supply": 748,
      vertex: 812.4,
    },
    variance: 8.6,
    status: "review",
    boundingBox: {
      pageNumber: 1,
      xMin: 0.12,
      yMin: 0.43,
      xMax: 0.88,
      yMax: 0.475,
    },
  },
  {
    id: "bearing-kit",
    code: "BK-0902",
    description: "Precision bearing kit",
    quantity: 48,
    unit: "sets",
    prices: {
      atlas: 96.25,
      "meridian-supply": 102.8,
      vertex: 91.6,
    },
    variance: 12.3,
    status: "verified",
    boundingBox: {
      pageNumber: 1,
      xMin: 0.12,
      yMin: 0.5,
      xMax: 0.88,
      yMax: 0.545,
    },
  },
  {
    id: "sensor-module",
    code: "SN-3321",
    description: "Optical sensor module",
    quantity: 18,
    unit: "units",
    prices: {
      atlas: 215,
      "meridian-supply": 208.75,
      vertex: 229.5,
    },
    variance: 9.9,
    status: "verified",
    boundingBox: {
      pageNumber: 1,
      xMin: 0.12,
      yMin: 0.57,
      xMax: 0.88,
      yMax: 0.615,
    },
  },
];

export const tcoMetrics: TcoMetric[] = [
  {
    id: "best-price",
    label: "Lowest raw price",
    value: "$18,420",
    detail: "Atlas Industrial · 4 line items",
    accent: "emerald",
    iconLabel: "LP",
  },
  {
    id: "fastest-delivery",
    label: "Fastest delivery",
    value: "12 days",
    detail: "Vertex Systems · −5 days",
    accent: "blue",
    iconLabel: "FD",
  },
  {
    id: "recommended-tco",
    label: "Recommended TCO",
    value: "$19,108",
    detail: "Atlas Industrial · 90-day terms",
    accent: "amber",
    iconLabel: "TCO",
  },
];

export const counterOfferDraft =
  "Hi Atlas team,\n\nThank you for sharing your quotation. We are reviewing proposals for the SM-2400 and related components. Could you revisit the pricing and let us know whether you can improve the total offer while maintaining the current delivery schedule and 90-day payment terms?\n\nWe look forward to working together.\n\nBest,\nProcurement Team";
