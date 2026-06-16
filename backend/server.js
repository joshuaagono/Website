const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const dbPath = path.join(__dirname, "db.json");
const port = Number(process.env.PORT || 4180);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".ts": "text/plain; charset=utf-8",
};

async function readDb() {
  return JSON.parse(await fs.readFile(dbPath, "utf8"));
}

async function writeDb(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
    "access-control-allow-headers": "content-type",
  });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function clientIp(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
}

function detectProvider(ip) {
  if (ip.includes("127.0.0.1") || ip.includes("::1")) return "Local development network";
  return "Provider lookup required";
}

async function handleApi(req, res, url) {
  const db = await readDb();

  if (req.method === "OPTIONS") return sendJson(res, 204, {});

  if (req.method === "GET" && url.pathname === "/api/admin/summary") {
    return sendJson(res, 200, {
      users: db.users.length,
      pendingUsers: db.users.filter((user) => user.status === "pending").length,
      analyticsSessions: db.analytics.length,
      auditEvents: db.adminAuditLog.length,
    });
  }

  if (req.method === "GET" && url.pathname === "/api/admin/users") {
    return sendJson(res, 200, db.users);
  }

  if (req.method === "PUT" && url.pathname.startsWith("/api/admin/users/")) {
    const id = decodeURIComponent(url.pathname.split("/").pop());
    const body = await readBody(req);
    const user = db.users.find((item) => item.id === id);
    if (!user) return sendJson(res, 404, { error: "User not found" });
    Object.assign(user, body, { lastSeen: new Date().toISOString() });
    db.adminAuditLog.push({ id: `AUD-${Date.now()}`, action: `Updated user ${id}`, actor: "admin", createdAt: new Date().toISOString() });
    await writeDb(db);
    return sendJson(res, 200, user);
  }

  if (req.method === "GET" && url.pathname === "/api/analytics/users") {
    return sendJson(res, 200, db.analytics);
  }

  if (req.method === "POST" && url.pathname === "/api/analytics/session") {
    const body = await readBody(req);
    const session = {
      sessionId: body.sessionId || `SES-${Date.now()}`,
      user: body.user || "Anonymous",
      ipAddress: clientIp(req),
      browser: body.browser || req.headers["user-agent"] || "Unknown",
      networkProvider: body.networkProvider || detectProvider(clientIp(req)),
      deviceType: body.deviceType || "unknown",
      location: body.location || "Not provided",
      pagesVisited: body.pagesVisited || [],
      totalSecondsSpent: body.totalSecondsSpent || 0,
      accessCount: body.accessCount || 1,
      downloads: body.downloads || 0,
    };
    db.analytics.unshift(session);
    db.adminAuditLog.push({ id: `AUD-${Date.now()}`, action: `Captured analytics session ${session.sessionId}`, actor: "analytics", createdAt: new Date().toISOString() });
    await writeDb(db);
    return sendJson(res, 201, session);
  }

  if (req.method === "GET" && url.pathname === "/api/admin/audit-log") {
    return sendJson(res, 200, db.adminAuditLog);
  }

  return sendJson(res, 404, { error: "API route not found" });
}

async function serveStatic(req, res, url) {
  const safePath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.resolve(rootDir, `.${safePath}`);
  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, { "content-type": contentTypes[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) return await handleApi(req, res, url);
    return await serveStatic(req, res, url);
  } catch (error) {
    return sendJson(res, 500, { error: error.message });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`GraceStream backend running at http://127.0.0.1:${port}`);
});
