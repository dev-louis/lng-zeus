export type Publication = {
  id: string;
  name: string;
  group: string;
  circulation: string;
  hgvPrice?: string | null;
  premisesPrice?: string | null;
  trusteePrice?: string | null;
  colPrice?: string | null;
  colWidth?: string | null;
  col2Width?: string | null;
  circulationCount?: number | null;
  confirmed: boolean;
  paperContactName?: string | null;
  paperContactEmail?: string | null;
  paperContactNumber?: string | null;
  paperVoucherContactName?: string | null;
  paperVoucherContactNumber?: string | null;
  adfast?: boolean | null;
  deadline?: string | null;
  specialInstructions?: string | null;
  sendArtwork?: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type LegacyPublication = {
  id: string;
  name: string;
  hgvPrice: string;
  colPrice: string;
  col2Width: string;
  colWidth: 27;
  circulation: string;
  confirmed: boolean;
  group: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Grant = {
  id: string;
  organizationId: string;
  noticeId?: string;
  actualHeight?: string;
  operatingCentre: string;
  vehicles: number;
  trailers: number;
  publicationId: string;
  publication?: LegacyPublication;
  estimatedCost?: string;
  actualCost?: string;
  voucherCopyUrl?: string;
  voucherCopyKey?: string;
  createdAt: Date;
  updatedAt: Date;
};
export type Variation = {
  id: string;
  organizationId: string;
  noticeId?: string;
  operatingCentre: string;
  extraVehicles: number;
  extraTrailers: number;
  publicationId: string;
  publication?: LegacyPublication;
  estimatedCost?: string;
  actualCost?: string;
  voucherCopyUrl?: string;
  voucherCopyKey?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type HGVNotice = {
  id: string;
  organizationId: string;
  noticeType: "variation" | "grant";
  status:
    | "awaiting_quote"
    | "awaiting_payment"
    | "processing"
    | "published"
    | "archived"
    | "cancelled";
  emailAddress: string;
  correspondenceAddress: string;
  nameOfOperator: string;
  tradingName?: string;
  totalEstimatedCost?: string;
  totalActualCost?: string;
  createdAt: Date;
  updatedAt: Date;
  grants?: Grant[];
  variations?: Variation[];
};

export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  image: null;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | null;
  stripeCustomerId: string | null;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined;
  notice: HGVNotice[];
};

export type HGVNoticeWithUser = HGVNotice & {
  user: User;
  grant: Grant[];
  variation: Variation[];
};

export type APIKey = {
  id: string;
  name?: string | null;
  start?: string | null;
  prefix?: string | null;
  userId: string;
  refillInterval?: number | null;
  refillAmount?: number | null;
  lastRefillAt?: Date | null;
  enabled: boolean;
  rateLimitEnabled: boolean;
  rateLimitTimeWindow?: number | null;
  rateLimitMax?: number | null;
  requestCount: number;
  remaining?: number | null;
  lastRequest?: Date | null;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  permissions?: Record<string, string[]> | null;
  metadata?: Record<string, any> | null;
};
