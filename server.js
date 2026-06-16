// GraceStream Church Platform — prototype backend
// Dependency-free Node HTTP server with JSON file persistence.
// Run: node server.js   (defaults to PORT 8787)
//
// This is the prototype backend described in ARCHITECTURE.md. It implements
// the admin portal endpoints the frontend (app.js) already calls, plus the
// rest of the production API sketch as simple, auditable JSON-file storage.
// Swap this module out for NestJS/Postgres later without changing the
// frontend's fetch contracts.

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const PORT = process.env.PORT || 8787;
const DB_PATH = path.join(__dirname, "db.json");
const SEED_PATH = path.join(__dirname, "db.seed.json");
const STATIC_ROOT = path.join(__dirname, "..");

const ACCESS_LEVELS = ["guest", "member", "worker", "media", "pastor", "finance", "admin", "super_admin"];

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

function loadDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.copyFileSync(SEED_PATH, DB_PATH);
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

let db = loadDb();
let writeQueued = false;

function saveDb() {
  // Coalesce bursts of writes within the same tick into one disk write.
  if (writeQueued) return;
  writeQueued = true;
  setImmediate(() => {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    writeQueued = false;
  });
}

function nextId(kind, prefix) {
  const n = db.nextIds[kind] || 1;
  db.nextIds[kind] = n + 1;
  return `${prefix}_${String(n).padStart(3, "0")}`;
}

function addAudit(actor, action, target) {
  db.auditLog.push({ id: nextId("audit", "aud"), actor, action, target, createdAt: new Date().toISOString() });
}

// ---------------------------------------------------------------------------
// Admin auth (simple shared password, prototype only)
// ---------------------------------------------------------------------------

const ADMIN_SESSION_COOKIE = "gs_admin_session";
const adminSessions = new Map(); // token -> expiry timestamp
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100_000, 64, "sha256").toString("hex");
}

function setAdminPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  db.adminAuth = { passwordHash: hashPassword(password, salt), passwordSalt: salt };
  saveDb();
}

function verifyAdminPassword(password) {
  if (!db.adminAuth || !db.adminAuth.passwordHash) return false;
  const candidate = hashPassword(password, db.adminAuth.passwordSalt);
  return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(db.adminAuth.passwordHash, "hex"));
}

function createSession() {
  const token = crypto.randomBytes(32).toString("hex");
  adminSessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  const out = {};
  header.split(";").forEach((part) => {
    const idx = part.indexOf("=");
    if (idx === -1) return;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  });
  return out;
}

function hasValidSession(req) {
  const cookies = parseCookies(req);
  const token = cookies[ADMIN_SESSION_COOKIE];
  if (!token) return false;
  const expiry = adminSessions.get(token);
  if (!expiry || expiry < Date.now()) {
    adminSessions.delete(token);
    return false;
  }
  return true;
}

// Admin-panel auth: accepts either a valid session cookie OR the
// x-access-level: admin header (kept for the existing API-key style flows).
function requireAdminSession(req, res) {
  if (hasValidSession(req)) return true;
  if ((req.headers["x-access-level"] || "") === "admin") return true;
  forbidden(res, "Admin login required");
  return false;
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

function sendJson(res, status, body, extraHeaders = {}) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(text),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "content-type, x-actor, x-access-level",
    "Access-Control-Allow-Credentials": "true",
    ...extraHeaders,
  });
  res.end(text);
}

function notFound(res) {
  sendJson(res, 404, { error: "Not found" });
}

function badRequest(res, message) {
  sendJson(res, 400, { error: message });
}

function forbidden(res, message) {
  sendJson(res, 403, { error: message });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 5_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

// Minimum role check. Real deployments should replace this header-based
// stand-in with signed sessions / JWTs, per ARCHITECTURE.md identity module.
function requireAccess(req, res, minLevel) {
  const level = req.headers["x-access-level"] || "guest";
  const rank = ACCESS_LEVELS.indexOf(level);
  const minRank = ACCESS_LEVELS.indexOf(minLevel);
  if (rank === -1 || rank < minRank) {
    forbidden(res, `Requires access level >= ${minLevel}`);
    return null;
  }
  return level;
}

function actorFromReq(req) {
  return req.headers["x-actor"] || "unknown@gracestream.org";
}

// ---------------------------------------------------------------------------
// Domain logic
// ---------------------------------------------------------------------------

function scoreApproval(user) {
  let risk = 50 - user.verificationScore * 5;
  const reasons = [];

  if (user.sponsorUserIds.length > 0) {
    risk -= 15;
    reasons.push("Has an existing sponsor on the platform");
  }
  if (user.verificationScore >= 7) {
    risk -= 10;
    reasons.push("Verification score above threshold");
  } else {
    reasons.push("Verification score below threshold");
  }

  let recommendedAccess = "guest";
  const interests = user.ministryInterests.map((i) => i.toLowerCase());
  if (interests.some((i) => i.includes("finance"))) {
    recommendedAccess = "finance";
    risk += 10;
    reasons.push("Ministry interest: Finance team");
  } else if (interests.some((i) => i.includes("media"))) {
    recommendedAccess = "media";
    reasons.push("Ministry interest: Media team");
  } else if (user.verificationScore >= 7) {
    recommendedAccess = "worker";
  } else {
    recommendedAccess = "member";
  }

  risk = Math.max(0, Math.min(100, Math.round(risk)));
  const requiresHumanApproval = risk >= 20 || recommendedAccess === "finance" || recommendedAccess === "admin";
  const notificationChannels = requiresHumanApproval ? ["slack", "email"] : ["slack"];

  return { recommendedAccess, riskScore: risk, reasons, requiresHumanApproval, notificationChannels };
}

// ---------------------------------------------------------------------------
// Route table
// ---------------------------------------------------------------------------

const routes = [];
function route(method, pattern, handler) {
  // pattern supports :param segments, e.g. /api/calendar/:date
  const keys = [];
  const regex = new RegExp(
    "^" +
      pattern
        .split("/")
        .map((segment) => {
          if (segment.startsWith(":")) {
            keys.push(segment.slice(1));
            return "([^/]+)";
          }
          return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        })
        .join("/") +
      "$"
  );
  routes.push({ method, regex, keys, handler });
}

function matchRoute(method, pathname) {
  for (const r of routes) {
    if (r.method !== method) continue;
    const match = r.regex.exec(pathname);
    if (match) {
      const params = {};
      r.keys.forEach((key, i) => (params[key] = decodeURIComponent(match[i + 1])));
      return { handler: r.handler, params };
    }
  }
  return null;
}

// --- Admin auth (login for the /admin content editor) -------------------

route("GET", "/api/admin-auth/status", (req, res) => {
  sendJson(res, 200, {
    passwordSet: Boolean(db.adminAuth && db.adminAuth.passwordHash),
    loggedIn: hasValidSession(req),
  });
});

route("POST", "/api/admin-auth/setup", async (req, res) => {
  if (db.adminAuth && db.adminAuth.passwordHash) {
    return badRequest(res, "Admin password is already set. Use login instead.");
  }
  const body = await readBody(req);
  if (!body.password || String(body.password).length < 8) {
    return badRequest(res, "Password must be at least 8 characters.");
  }
  setAdminPassword(String(body.password));
  const token = createSession();
  addAudit("admin", "set_admin_password", "admin-auth");
  sendJson(res, 201, { ok: true }, {
    "Set-Cookie": `${ADMIN_SESSION_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${SESSION_TTL_MS / 1000}; SameSite=Lax`,
  });
});

route("POST", "/api/admin-auth/login", async (req, res) => {
  const body = await readBody(req);
  if (!db.adminAuth || !db.adminAuth.passwordHash) {
    return badRequest(res, "No admin password set yet. Use setup first.");
  }
  if (!verifyAdminPassword(String(body.password || ""))) {
    addAudit("unknown", "failed_admin_login", "admin-auth");
    return forbidden(res, "Incorrect password");
  }
  const token = createSession();
  addAudit("admin", "admin_login", "admin-auth");
  sendJson(res, 200, { ok: true }, {
    "Set-Cookie": `${ADMIN_SESSION_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${SESSION_TTL_MS / 1000}; SameSite=Lax`,
  });
});

route("POST", "/api/admin-auth/logout", async (req, res) => {
  const cookies = parseCookies(req);
  const token = cookies[ADMIN_SESSION_COOKIE];
  if (token) adminSessions.delete(token);
  sendJson(res, 200, { ok: true }, {
    "Set-Cookie": `${ADMIN_SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
  });
});

route("POST", "/api/admin-auth/change-password", async (req, res) => {
  if (!requireAdminSession(req, res)) return;
  const body = await readBody(req);
  if (!body.newPassword || String(body.newPassword).length < 8) {
    return badRequest(res, "Password must be at least 8 characters.");
  }
  if (!verifyAdminPassword(String(body.currentPassword || ""))) {
    return forbidden(res, "Current password is incorrect");
  }
  setAdminPassword(String(body.newPassword));
  addAudit("admin", "changed_admin_password", "admin-auth");
  sendJson(res, 200, { ok: true });
});

// --- Admin summary -----------------------------------------------------

route("GET", "/api/admin/summary", (req, res) => {
  if (!requireAccess(req, res, "admin")) return;
  sendJson(res, 200, {
    pendingUsers: db.users.filter((u) => u.status === "pending").length,
    auditEvents: db.auditLog.length,
    analyticsSessions: db.analyticsSessions.length,
    users: db.users.length,
    mediaJobsRunning: db.mediaJobs.filter((j) => j.status === "running" || j.status === "queued").length,
    liveStreamRooms: 4,
    monthlyGivingMinor: db.payments
      .filter((p) => p.status === "succeeded")
      .reduce((sum, p) => sum + p.amountMinor, 0),
  });
});

// --- Users and access ----------------------------------------------------

route("GET", "/api/users", (req, res) => {
  if (!requireAccess(req, res, "admin")) return;
  sendJson(res, 200, db.users);
});

route("POST", "/api/auth/register", async (req, res) => {
  const body = await readBody(req);
  if (!body.fullName || !body.email) return badRequest(res, "fullName and email are required");
  const user = {
    id: nextId("user", "usr"),
    fullName: body.fullName,
    email: body.email,
    accessLevel: "guest",
    ministryInterests: Array.isArray(body.ministryInterests) ? body.ministryInterests : [],
    verificationScore: Number(body.verificationScore) || 0,
    sponsorUserIds: Array.isArray(body.sponsorUserIds) ? body.sponsorUserIds : [],
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  addAudit(actorFromReq(req), "registered_user", user.id);
  saveDb();
  sendJson(res, 201, user);
});

route("POST", "/api/approvals/evaluate", async (req, res) => {
  const body = await readBody(req);
  const user = db.users.find((u) => u.id === body.userId);
  if (!user) return badRequest(res, "Unknown userId");
  const decision = scoreApproval(user);
  const approval = {
    id: nextId("approval", "apr"),
    userId: user.id,
    ...decision,
    status: decision.requiresHumanApproval ? "pending" : "approved",
    createdAt: new Date().toISOString(),
  };
  db.approvals.push(approval);
  if (!decision.requiresHumanApproval) {
    user.accessLevel = decision.recommendedAccess;
    user.status = "active";
  }
  addAudit(actorFromReq(req), "evaluated_approval", approval.id);
  saveDb();
  sendJson(res, 200, approval);
});

route("POST", "/api/approvals/notify", async (req, res) => {
  const body = await readBody(req);
  const approval = db.approvals.find((a) => a.id === body.approvalId);
  if (!approval) return badRequest(res, "Unknown approvalId");
  addAudit(actorFromReq(req), `notified_${body.channel || "slack"}`, approval.id);
  saveDb();
  sendJson(res, 200, { sent: true, channel: body.channel || "slack", approvalId: approval.id });
});

route("POST", "/api/approvals/:id/decide", async (req, res, params) => {
  if (!requireAccess(req, res, "worker")) return;
  const body = await readBody(req);
  const approval = db.approvals.find((a) => a.id === params.id);
  if (!approval) return notFound(res);
  if (!["approved", "rejected"].includes(body.decision)) return badRequest(res, "decision must be approved|rejected");
  approval.status = body.decision;
  const user = db.users.find((u) => u.id === approval.userId);
  if (user && body.decision === "approved") {
    user.accessLevel = approval.recommendedAccess;
    user.status = "active";
  }
  if (user && body.decision === "rejected") {
    user.status = "rejected";
  }
  addAudit(actorFromReq(req), `${body.decision}_user`, approval.userId);
  saveDb();
  sendJson(res, 200, approval);
});

// --- Media ----------------------------------------------------------------

route("GET", "/api/media/jobs", (req, res) => {
  if (!requireAccess(req, res, "media")) return;
  sendJson(res, 200, db.mediaJobs);
});

route("POST", "/api/media/upload-complete", async (req, res) => {
  const body = await readBody(req);
  const job = {
    id: nextId("job", "job"),
    serviceId: body.serviceId || `SVC-${Date.now()}`,
    title: body.title || "Untitled service",
    steps: ["detect_end", "transcode", "caption", "summarize", "publish", "notify"],
    currentStepIndex: 1,
    status: "queued",
    updatedAt: new Date().toISOString(),
  };
  db.mediaJobs.push(job);
  addAudit(actorFromReq(req), "queued_media_job", job.id);
  saveDb();
  sendJson(res, 201, job);
});

route("POST", "/api/media/transcode", async (req, res) => {
  const body = await readBody(req);
  const job = db.mediaJobs.find((j) => j.id === body.jobId);
  if (!job) return badRequest(res, "Unknown jobId");
  job.status = "running";
  job.currentStepIndex = Math.max(job.currentStepIndex, 2);
  job.updatedAt = new Date().toISOString();
  saveDb();
  sendJson(res, 200, job);
});

route("POST", "/api/media/publish", async (req, res) => {
  if (!requireAccess(req, res, "media")) return;
  const body = await readBody(req);
  const job = db.mediaJobs.find((j) => j.id === body.jobId);
  if (!job) return badRequest(res, "Unknown jobId");
  job.status = "published";
  job.currentStepIndex = job.steps.length;
  job.updatedAt = new Date().toISOString();
  addAudit(actorFromReq(req), "published_media_job", job.id);
  saveDb();
  sendJson(res, 200, job);
});

// --- Archive bundles --------------------------------------------------

route("GET", "/api/archive/bundles", (req, res) => {
  sendJson(res, 200, db.archiveBundles);
});

route("POST", "/api/archive/bundles", async (req, res) => {
  if (!requireAccess(req, res, "media")) return;
  const body = await readBody(req);
  if (!body.title) return badRequest(res, "title is required");
  const bundle = {
    id: body.id || `ARC-${Date.now()}`,
    title: body.title,
    category: body.category || "services",
    featured: Boolean(body.featured),
    permissions: body.permissions || "member",
    validated: false,
  };
  db.archiveBundles.push(bundle);
  addAudit(actorFromReq(req), "created_archive_bundle", bundle.id);
  saveDb();
  sendJson(res, 201, bundle);
});

route("PATCH", "/api/archive/bundles/:id", async (req, res, params) => {
  if (!requireAccess(req, res, "media")) return;
  const bundle = db.archiveBundles.find((b) => b.id === params.id);
  if (!bundle) return notFound(res);
  const body = await readBody(req);
  Object.assign(bundle, body);
  addAudit(actorFromReq(req), "updated_archive_bundle", bundle.id);
  saveDb();
  sendJson(res, 200, bundle);
});

// --- Site content (powers the public site AND the /admin editor) --------
// This is what app.js fetches at boot, and what /admin reads & writes.

route("GET", "/api/content/page-text", (req, res) => {
  sendJson(res, 200, db.content.pageText);
});

route("PUT", "/api/content/page-text/:section", async (req, res, params) => {
  if (!requireAdminSession(req, res)) return;
  const body = await readBody(req);
  db.content.pageText[params.section] = body;
  addAudit(actorFromReq(req), "updated_page_text", params.section);
  saveDb();
  sendJson(res, 200, db.content.pageText[params.section]);
});

route("GET", "/api/content/resources", (req, res) => {
  sendJson(res, 200, db.content.resources);
});

route("POST", "/api/content/resources", async (req, res) => {
  if (!requireAdminSession(req, res)) return;
  const body = await readBody(req);
  if (!body.title || !body.type) return badRequest(res, "title and type are required");
  const resource = {
    id: body.id || `RES-${nextId("resource", "r")}`,
    serial: body.serial || `GS-RES-${String(db.nextIds.resource).padStart(4, "0")}`,
    type: body.type,
    title: body.title,
    date: body.date || new Date().toISOString().slice(0, 10),
    preacher: body.preacher || "",
    excerpt: body.excerpt || "",
    tags: body.tags || "",
    ...(body.content ? { content: Array.isArray(body.content) ? body.content : [String(body.content)] } : {}),
  };
  db.content.resources.push(resource);
  addAudit(actorFromReq(req), "created_resource", resource.id);
  saveDb();
  sendJson(res, 201, resource);
});

route("PUT", "/api/content/resources/:id", async (req, res, params) => {
  if (!requireAdminSession(req, res)) return;
  const resource = db.content.resources.find((r) => r.id === params.id);
  if (!resource) return notFound(res);
  const body = await readBody(req);
  Object.assign(resource, body);
  addAudit(actorFromReq(req), "updated_resource", resource.id);
  saveDb();
  sendJson(res, 200, resource);
});

route("DELETE", "/api/content/resources/:id", async (req, res, params) => {
  if (!requireAdminSession(req, res)) return;
  const idx = db.content.resources.findIndex((r) => r.id === params.id);
  if (idx === -1) return notFound(res);
  db.content.resources.splice(idx, 1);
  addAudit(actorFromReq(req), "deleted_resource", params.id);
  saveDb();
  sendJson(res, 200, { deleted: true });
});

route("GET", "/api/content/calendar-events", (req, res) => {
  sendJson(res, 200, db.content.calendarEvents);
});

route("POST", "/api/content/calendar-events", async (req, res) => {
  if (!requireAdminSession(req, res)) return;
  const body = await readBody(req);
  if (!body.title || !body.date) return badRequest(res, "title and date are required");
  const event = {
    id: body.id || `evt-${nextId("event", "e")}`,
    date: body.date,
    title: body.title,
    time: body.time || "All day",
    type: body.type || "service",
    location: body.location || "",
    owner: body.owner || "",
    color: body.color || "blue",
    resources: Array.isArray(body.resources) ? body.resources : [],
  };
  db.content.calendarEvents.push(event);
  addAudit(actorFromReq(req), "created_calendar_event", event.id);
  saveDb();
  sendJson(res, 201, event);
});

route("PUT", "/api/content/calendar-events/:id", async (req, res, params) => {
  if (!requireAdminSession(req, res)) return;
  const event = db.content.calendarEvents.find((e) => e.id === params.id);
  if (!event) return notFound(res);
  const body = await readBody(req);
  Object.assign(event, body);
  addAudit(actorFromReq(req), "updated_calendar_event", event.id);
  saveDb();
  sendJson(res, 200, event);
});

route("DELETE", "/api/content/calendar-events/:id", async (req, res, params) => {
  if (!requireAdminSession(req, res)) return;
  const idx = db.content.calendarEvents.findIndex((e) => e.id === params.id);
  if (idx === -1) return notFound(res);
  db.content.calendarEvents.splice(idx, 1);
  addAudit(actorFromReq(req), "deleted_calendar_event", params.id);
  saveDb();
  sendJson(res, 200, { deleted: true });
});

route("GET", "/api/content/archive-bundles", (req, res) => {
  sendJson(res, 200, db.content.contentArchiveBundles);
});

route("POST", "/api/content/archive-bundles", async (req, res) => {
  if (!requireAdminSession(req, res)) return;
  const body = await readBody(req);
  if (!body.title) return badRequest(res, "title is required");
  const bundle = {
    id: body.id || `ARC-${nextId("bundle", "b")}`,
    serialBase: body.serialBase || `GS-ARC-${String(db.nextIds.bundle).padStart(4, "0")}`,
    category: body.category || "services",
    title: body.title,
    date: body.date || "",
    dateIso: body.dateIso || new Date().toISOString().slice(0, 10),
    preacher: body.preacher || "",
    description: body.description || "",
    files: body.files || { video: "", audio: "", pdf: "", epub: "" },
    content: body.content || { pdf: [], epub: [] },
  };
  db.content.contentArchiveBundles.push(bundle);
  addAudit(actorFromReq(req), "created_content_bundle", bundle.id);
  saveDb();
  sendJson(res, 201, bundle);
});

route("PUT", "/api/content/archive-bundles/:id", async (req, res, params) => {
  if (!requireAdminSession(req, res)) return;
  const bundle = db.content.contentArchiveBundles.find((b) => b.id === params.id);
  if (!bundle) return notFound(res);
  const body = await readBody(req);
  Object.assign(bundle, body);
  addAudit(actorFromReq(req), "updated_content_bundle", bundle.id);
  saveDb();
  sendJson(res, 200, bundle);
});

route("DELETE", "/api/content/archive-bundles/:id", async (req, res, params) => {
  if (!requireAdminSession(req, res)) return;
  const idx = db.content.contentArchiveBundles.findIndex((b) => b.id === params.id);
  if (idx === -1) return notFound(res);
  db.content.contentArchiveBundles.splice(idx, 1);
  addAudit(actorFromReq(req), "deleted_content_bundle", params.id);
  saveDb();
  sendJson(res, 200, { deleted: true });
});

// --- Calendar ---------------------------------------------------------

route("GET", "/api/calendar/:date", (req, res, params) => {
  sendJson(res, 200, { date: params.date, events: [] });
});

// --- Payments & donations -----------------------------------------------

route("GET", "/api/payments", (req, res) => {
  if (!requireAccess(req, res, "finance")) return;
  sendJson(res, 200, db.payments);
});

route("POST", "/api/payments/checkout", async (req, res) => {
  const body = await readBody(req);
  const payment = {
    id: nextId("payment", "pay"),
    kind: "convention",
    fund: body.fund || "building",
    amountMinor: Number(body.amountMinor) || 0,
    currency: body.currency || "USD",
    provider: body.provider || "stripe",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  db.payments.push(payment);
  saveDb();
  sendJson(res, 201, payment);
});

route("POST", "/api/donations", async (req, res) => {
  const body = await readBody(req);
  const payment = {
    id: nextId("payment", "pay"),
    kind: "donation",
    fund: body.fund || "offering",
    amountMinor: Number(body.amountMinor) || 0,
    currency: body.currency || "USD",
    provider: body.provider || "stripe",
    status: "succeeded",
    createdAt: new Date().toISOString(),
  };
  db.payments.push(payment);
  addAudit(actorFromReq(req), "recorded_donation", payment.id);
  saveDb();
  sendJson(res, 201, payment);
});

// --- AI logs / chat -----------------------------------------------------

route("GET", "/api/ai/logs", (req, res) => {
  if (!requireAccess(req, res, "admin")) return;
  sendJson(res, 200, db.aiLogs);
});

route("POST", "/api/chat", async (req, res) => {
  const body = await readBody(req);
  const log = {
    id: nextId("ai", "ai"),
    kind: "chatbot",
    summary: `Answered: "${String(body.message || "").slice(0, 80)}"`,
    confidence: 0.8,
    createdAt: new Date().toISOString(),
  };
  db.aiLogs.push(log);
  saveDb();
  sendJson(res, 200, {
    answer: "This is a prototype response. Connect the OpenAI API per ARCHITECTURE.md for real retrieval-augmented answers.",
    suggestedActions: [],
    citations: [],
  });
});

// --- Search ---------------------------------------------------------------

route("POST", "/api/search", async (req, res) => {
  await readBody(req);
  sendJson(res, 200, { results: [] });
});

// --- Audit log ----------------------------------------------------------

route("GET", "/api/admin/audit-log", (req, res) => {
  if (!requireAccess(req, res, "admin")) return;
  sendJson(res, 200, db.auditLog.slice().reverse());
});

// --- Analytics ------------------------------------------------------------

route("GET", "/api/analytics/users", (req, res) => {
  if (!requireAccess(req, res, "admin")) return;
  sendJson(res, 200, db.analyticsSessions);
});

route("POST", "/api/analytics/session", async (req, res) => {
  const body = await readBody(req);
  const session = {
    sessionId: nextId("session", "sess"),
    user: body.user || "Anonymous",
    ipAddress: body.ipAddress || "0.0.0.0",
    browser: body.browser || "Unknown",
    networkProvider: body.networkProvider || "Unknown",
    deviceType: body.deviceType || "unknown",
    location: typeof body.location === "string" ? body.location : "Not provided",
    pagesVisited: Array.isArray(body.pagesVisited) ? body.pagesVisited : [],
    totalSecondsSpent: Number(body.totalSecondsSpent) || 0,
    accessCount: Number(body.accessCount) || 1,
    downloads: Number(body.downloads) || 0,
    createdAt: new Date().toISOString(),
  };
  db.analyticsSessions.push(session);
  saveDb();
  sendJson(res, 201, session);
});

route("POST", "/api/analytics/event", async (req, res) => {
  await readBody(req);
  sendJson(res, 200, { recorded: true });
});

route("POST", "/api/analytics/download", async (req, res) => {
  const body = await readBody(req);
  addAudit(actorFromReq(req), "download", body.resourceId || "unknown");
  saveDb();
  sendJson(res, 200, { recorded: true });
});

route("POST", "/api/analytics/location-consent", async (req, res) => {
  await readBody(req);
  sendJson(res, 200, { recorded: true });
});

// --- Convention -------------------------------------------------------

route("POST", "/api/convention/register", async (req, res) => {
  const body = await readBody(req);
  if (!body.attendeeName || !body.email) return badRequest(res, "attendeeName and email are required");
  const registration = {
    id: crypto.randomUUID(),
    attendeeName: body.attendeeName,
    email: body.email,
    packageCode: body.packageCode || "standard",
    needs: Array.isArray(body.needs) ? body.needs : [],
    paymentStatus: body.packageCode === "vip_partner" ? "pending" : "not_required",
    qrCodeUrl: `https://gracestream.example/qr/${crypto.randomUUID()}.png`,
  };
  saveDb();
  sendJson(res, 201, registration);
});

// ---------------------------------------------------------------------------
// Static file serving (so the same prototype server can host index.html too)
// ---------------------------------------------------------------------------

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

function serveStatic(req, res, pathname) {
  let safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  if (safePath === "/admin" || safePath === "/admin/") safePath = "/admin.html";
  const filePath = path.join(STATIC_ROOT, safePath === "/" ? "/index.html" : safePath);
  if (!filePath.startsWith(STATIC_ROOT)) return notFound(res);
  fs.readFile(filePath, (err, data) => {
    if (err) return notFound(res);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "content-type, x-actor, x-access-level",
      "Access-Control-Allow-Credentials": "true",
    });
    return res.end();
  }

  const match = matchRoute(req.method, url.pathname);
  if (!match) {
    if (req.method === "GET" && !url.pathname.startsWith("/api/")) {
      return serveStatic(req, res, url.pathname);
    }
    return notFound(res);
  }

  try {
    await match.handler(req, res, match.params);
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "Internal server error", message: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`GraceStream prototype backend listening on http://localhost:${PORT}`);
  console.log(`Serving frontend from ${STATIC_ROOT} and persisting data to ${DB_PATH}`);
});
