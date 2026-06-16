export type AccessLevel =
  | "guest"
  | "member"
  | "worker"
  | "media"
  | "pastor"
  | "finance"
  | "admin"
  | "super_admin";

export type ApprovalChannel = "telegram" | "slack" | "email";

export type MediaKind = "live_video" | "video" | "audio" | "photo" | "pdf" | "docx" | "epub";

export type PermissionKey =
  | "*"
  | "users.approve"
  | "roles.assign"
  | "calendar.edit"
  | "media.publish"
  | "archive.edit"
  | "analytics.view"
  | "payments.view"
  | "site.draft"
  | "site.publish"
  | "plugins.configure";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  accessLevel: AccessLevel;
  ministryInterests: string[];
  verificationScore: number;
  sponsorUserIds: string[];
  createdAt: string;
}

export interface RoleClass {
  id: string;
  name: AccessLevel | "editor" | "super_admin";
  permissions: PermissionKey[];
  canDelegate: boolean;
  editableSections?: string[];
}

export interface SiteSection {
  id: string;
  name: string;
  route: string;
  editableBy: string[];
  status: "draft" | "review" | "published";
  version: number;
}

export interface PluginIntegration {
  id: string;
  name: string;
  capability: string;
  status: "connected" | "ready" | "configurable" | "disabled" | "error";
  requiredPermissions: PermissionKey[];
  webhookUrl?: string;
}

export interface ApprovalDecision {
  userId: string;
  recommendedAccess: AccessLevel;
  riskScore: number;
  reasons: string[];
  requiresHumanApproval: boolean;
  notificationChannels: ApprovalChannel[];
}

export interface StreamSource {
  id: string;
  title: string;
  location: string;
  playbackUrl: string;
  audioOnlyUrl?: string;
  qualities: Array<"4k" | "1080p" | "720p" | "480p" | "audio">;
  supportsDvr: boolean;
  subtitleTracks: Array<{ language: string; url: string }>;
}

export interface MediaAutomationJob {
  id: string;
  serviceId: string;
  inputUrl: string;
  steps: Array<"detect_end" | "transcode" | "caption" | "summarize" | "publish" | "notify">;
  status: "queued" | "running" | "needs_review" | "published" | "failed";
}

export interface CalendarActivity {
  id: string;
  startsAt: string;
  title: string;
  accessLevel: AccessLevel;
  resources: Array<{
    id: string;
    kind: MediaKind;
    title: string;
    url: string;
    featured?: boolean;
  }>;
}

export interface SearchRequest {
  query: string;
  requesterAccessLevel: AccessLevel;
  fileTypes?: MediaKind[];
  dateRange?: { from: string; to: string };
  preacher?: string;
  serialNumber?: string;
  resourceId?: string;
  includeArchiveBundles?: boolean;
  archiveBundleId?: string;
  mode?: "metadata" | "inside_documents" | "all";
}

export interface SearchResult {
  resourceId: string;
  serialNumber: string;
  source: "library" | "archive";
  archiveBundleId?: string;
  archiveBundleTitle?: string;
  title: string;
  kind: MediaKind;
  date: string;
  preacher?: string;
  excerpt: string;
  confidence: number;
  sourcePage?: number;
  sourceTimestampSeconds?: number;
  matchedFields: Array<"name" | "date" | "serial" | "preacher" | "resource_id" | "document_content" | "transcript" | "photo_metadata">;
  extractedQuote?: string;
}

export interface ConventionRegistration {
  attendeeName: string;
  email: string;
  packageCode: "standard" | "family" | "volunteer" | "vip_partner";
  needs: string[];
  paymentStatus: "not_required" | "pending" | "paid" | "failed";
  qrCodeUrl?: string;
}

export interface DonationCheckout {
  amountMinor: number;
  currency: "USD" | "GBP" | "NGN" | "EUR";
  fund: "tithe" | "offering" | "missions" | "building" | "welfare";
  provider: "stripe" | "paystack" | "flutterwave" | "bank_transfer";
  successUrl: string;
  cancelUrl: string;
}

export interface AnalyticsSession {
  sessionId: string;
  userId?: string;
  ipAddress?: string;
  browser: string;
  networkProvider?: string;
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  location?: {
    latitude: number;
    longitude: number;
    precision: "precise" | "approximate";
    consented: boolean;
  };
  pagesVisited: Array<{
    path: string;
    enteredAt: string;
    secondsSpent: number;
  }>;
  totalSecondsSpent: number;
  accessCount: number;
  downloads: Array<{
    resourceId: string;
    kind: MediaKind;
    downloadedAt: string;
  }>;
}

export interface AiAnalyticsInsight {
  metric: "engagement" | "retention" | "downloads" | "location" | "device" | "content";
  summary: string;
  recommendedAction: string;
  confidence: number;
}

export interface AiAssistantRequest {
  userId?: string;
  message: string;
  currentPage: string;
  accessLevel: AccessLevel;
}

export interface AiAssistantResponse {
  answer: string;
  suggestedActions: Array<{
    label: string;
    href: string;
    requiresConfirmation: boolean;
  }>;
  citations: SearchResult[];
}
