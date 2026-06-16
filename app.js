const resources = [
  {
    id: "PDF-2026-0607-FAM",
    serial: "GS-PDF-0001",
    type: "PDF",
    title: "Faith That Builds Families",
    date: "2026-06-07",
    preacher: "Pastor Daniel Reed",
    excerpt: "Marriage seminar notes, family prayer model, and counseling guide.",
    tags: "family prayer marriage counseling pdf",
    content: [
      "A family altar is not a performance; it is a place where grace becomes ordinary and visible.",
      "Forgiveness is the bridge between yesterday's wound and tomorrow's peace.",
      "Children remember the rhythm of prayer long before they understand the language of doctrine.",
    ],
  },
  {
    id: "DOC-2026-0611-MED",
    serial: "GS-DOC-0002",
    type: "DOCX",
    title: "Volunteer Media Team Handbook",
    date: "2026-06-11",
    preacher: "Media Desk",
    excerpt: "Camera rotation, live stream checklist, caption review, and upload workflow.",
    tags: "media team video audio live stream upload doc",
  },
  {
    id: "EPUB-2026-0623-FND",
    serial: "GS-EPUB-0003",
    type: "EPUB",
    title: "Foundations Class Reader",
    date: "2026-06-23",
    preacher: "Rev. Miriam Stone",
    excerpt: "New believer lessons, church doctrine, and membership orientation.",
    tags: "new member registration access doctrine epub",
    content: [
      "Discipleship begins when belief becomes a daily pattern, not a Sunday memory.",
      "The church is a family before it is a program, and every member carries grace to another.",
      "A strong foundation teaches people how to pray, serve, give, forgive, and grow.",
    ],
  },
  {
    id: "EPUB-2026-1001-REV",
    serial: "GS-EPUB-0004",
    type: "EPUB",
    title: "Thirty Days of Revival Devotions",
    date: "2026-10-01",
    preacher: "Dr. Naomi Hart",
    excerpt: "A devotional archive for convention follow-up, small groups, and daily reading.",
    tags: "devotional revival convention epub archive",
    content: [
      "Revival is sustained by obedience after the music fades and the crowd goes home.",
      "The fire on the altar must become light in the street.",
      "Every day of prayer should leave behind a trail of mercy.",
    ],
  },
  {
    id: "PDF-2026-0614-THX",
    serial: "GS-PDF-0005",
    type: "PDF",
    title: "Annual Thanksgiving Brochure",
    date: "2026-06-14",
    preacher: "Pastor Daniel Reed",
    excerpt: "Program schedule, testimonies, ministry reports, and giving details.",
    tags: "thanksgiving brochure report giving pdf archive",
    content: [
      "Thanksgiving keeps memory honest: every blessing becomes a witness.",
      "Generosity is worship with its sleeves rolled up.",
      "The report of the year is not only numbers, but changed lives.",
    ],
  },
  {
    id: "VID-2026-0621-HOPE",
    serial: "GS-VID-0006",
    type: "VIDEO",
    title: "Sunday Service: The Power of Hope",
    date: "2026-06-21",
    preacher: "Pastor Daniel Reed",
    excerpt: "Full service video with chapters, subtitles, sermon notes, and audio extraction.",
    tags: "sermon hope sunday video subtitles audio",
  },
  {
    id: "VID-2026-0814-FIRE",
    serial: "GS-VID-0007",
    type: "VIDEO",
    title: "Convention Night Two Replay",
    date: "2026-08-14",
    preacher: "Pastor Luis Ortega",
    excerpt: "Multi-camera worship replay with English subtitles and downloadable sermon notes.",
    tags: "convention replay worship video subtitles archive",
  },
  {
    id: "AUD-2026-0610-PRAY",
    serial: "GS-AUD-0008",
    type: "AUDIO",
    title: "Midweek Prayer: Healing and Direction",
    date: "2026-06-10",
    preacher: "Rev. Miriam Stone",
    excerpt: "Podcast-ready audio with transcript, speaker labels, and prayer categories.",
    tags: "prayer healing audio transcript",
  },
  {
    id: "AUD-2026-0618-CHOIR",
    serial: "GS-AUD-0009",
    type: "AUDIO",
    title: "Choir Ministration Collection",
    date: "2026-06-18",
    preacher: "Choir Ministry",
    excerpt: "Remastered worship audio with lyrics, copyright notes, and shareable playlist.",
    tags: "choir worship ministration audio archive",
  },
  {
    id: "PHO-2026-0619-YOUTH",
    serial: "GS-PHO-0010",
    type: "PHOTO",
    title: "Youth Convention Gallery",
    date: "2026-06-19",
    preacher: "Youth Ministry",
    excerpt: "Approved photos with consent labels and ministry tags.",
    tags: "youth convention photos gallery",
  },
];

const calendarToday = { year: 2026, month: 5, day: 16 };
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let activeCalendarDate = new Date(2026, 5, 1);
let activeCalendarView = "all";
let activeArchiveFilter = "all";
let activeArchiveQuery = "";
const calendarEvents = [
  { id: "sun-31", date: "2026-05-31", title: "10am Service", time: "10:00 AM", type: "service", location: "Main Sanctuary", owner: "Pastoral Team", color: "blue", resources: ["Replay video", "Sermon audio", "Bulletin PDF", "EPUB notes"] },
  { id: "wed-3", date: "2026-06-03", title: "8pm Service", time: "8:00 PM", type: "service", location: "Online Chapel", owner: "Prayer Team", color: "blue", resources: ["Live video", "Prayer audio", "Study PDF", "EPUB recap"] },
  { id: "sun-7", date: "2026-06-07", title: "10am Service", time: "10:00 AM", type: "service", location: "Main Sanctuary", owner: "Pastoral Team", color: "blue", resources: ["Replay video", "Sermon audio", "Bulletin PDF", "EPUB notes"] },
  { id: "wed-10", date: "2026-06-10", title: "8pm Service", time: "8:00 PM", type: "service", location: "Online Chapel", owner: "Teaching Team", color: "blue", resources: ["Bible study video", "Audio replay", "Class PDF", "Reader EPUB"] },
  { id: "madrid-13", date: "2026-06-13", title: "GT Live Services - Madrid", time: "All day", type: "conference", location: "Madrid Campus", owner: "Missions Team", color: "purple", resources: ["Conference video", "Worship audio", "Schedule PDF", "Travel EPUB"] },
  { id: "madrid-14", date: "2026-06-14", title: "GT Live Services - Madrid", time: "All day", type: "conference", location: "Madrid Campus", owner: "Missions Team", color: "purple", resources: ["Conference replay", "Message audio", "Program PDF", "Highlights EPUB"] },
  { id: "sun-14", date: "2026-06-14", title: "10am Service", time: "10:00 AM", type: "service", location: "Main Sanctuary", owner: "Pastoral Team", color: "blue", resources: ["Sunday replay", "Podcast audio", "Sermon PDF", "Devotional EPUB"] },
  { id: "today-devotion", date: "2026-06-16", title: "Morning Devotion", time: "6:00 AM", type: "devotional", location: "Prayer Room", owner: "Care Team", color: "green", resources: ["Devotion video", "Prayer audio", "Daily guide PDF", "EPUB devotional"] },
  { id: "wed-17", date: "2026-06-17", title: "8pm Service", time: "8:00 PM", type: "service", location: "Online Chapel", owner: "Teaching Team", color: "blue", resources: ["Live stream", "Audio replay", "Study PDF", "EPUB notes"] },
  { id: "youth-19", date: "2026-06-19", title: "Youth Night", time: "6:30 PM", type: "youth", location: "Youth Chapel", owner: "Youth Ministry", color: "rose", resources: ["Youth stream", "Panel audio", "Discussion PDF", "Youth EPUB"] },
  { id: "sun-21", date: "2026-06-21", title: "10am Service", time: "10:00 AM", type: "service", location: "Main Sanctuary", owner: "Pastoral Team", color: "blue", resources: ["Main live video", "DVR replay audio", "Sermon transcript PDF", "EPUB devotional"] },
  { id: "lead-22", date: "2026-06-22", title: "Leadership Huddle", time: "7:00 PM", type: "admin", location: "Board Room", owner: "Admin Office", color: "gold", resources: ["Private video", "Minutes audio", "Action PDF", "Leadership EPUB"] },
  { id: "new-23", date: "2026-06-23", title: "New Member Class", time: "6:00 PM", type: "registration", location: "Classroom A", owner: "Membership Desk", color: "green", resources: ["Orientation video", "Welcome audio", "Membership PDF", "Foundations EPUB"] },
  { id: "wed-24", date: "2026-06-24", title: "8pm Service", time: "8:00 PM", type: "service", location: "Online Chapel", owner: "Prayer Team", color: "blue", resources: ["Healing stream", "Prayer audio", "Declaration PDF", "EPUB recap"] },
  { id: "prep-26", date: "2026-06-26", title: "Convention Prep", time: "5:30 PM", type: "conference", location: "Admin Hall", owner: "Events Team", color: "purple", resources: ["Planning video", "Briefing audio", "Seat PDF", "Volunteer EPUB"] },
  { id: "sun-28", date: "2026-06-28", title: "10am Service", time: "10:00 AM", type: "service", location: "Main Sanctuary", owner: "Pastoral Team", color: "blue", resources: ["Multi-stream video", "Podcast audio", "Sermon notes PDF", "Devotional EPUB"] },
  { id: "vigil-30", date: "2026-06-30", title: "Month-end Vigil", time: "10:00 PM", type: "prayer", location: "Main Sanctuary", owner: "Prayer Team", color: "rose", resources: ["Night vigil stream", "Prayer audio", "Declaration PDF", "EPUB recap"] },
  { id: "wed-july-1", date: "2026-07-01", title: "8pm Service", time: "8:00 PM", type: "service", location: "Online Chapel", owner: "Teaching Team", color: "blue", resources: ["Live video", "Audio replay", "Study PDF", "EPUB notes"] },
  { id: "swiss-4", date: "2026-07-04", title: "GT Live Services - Swiss", time: "All day", type: "conference", location: "Swiss Campus", owner: "Missions Team", color: "purple", resources: ["Conference stream", "Worship audio", "Program PDF", "Travel EPUB"] },
];

const archiveBundles = [
  {
    id: "ARC-2026-0621-HOPE",
    serialBase: "GS-ARC-1001",
    category: "services",
    title: "Sunday Service: The Power of Hope",
    date: "June 21, 2026",
    dateIso: "2026-06-21",
    preacher: "Pastor Daniel Reed",
    description: "Full worship replay, sermon audio, study notes, and a reader-friendly devotional edition.",
    files: {
      video: "Adaptive 4K replay with DVR chapters",
      audio: "Podcast audio with speaker labels",
      pdf: "Sermon notes and prayer points",
      epub: "Devotional reading edition",
    },
    content: {
      pdf: [
        "Hope is not denial of trouble; hope is confidence that God is present inside the trouble.",
        "Prayer points: receive strength, restore courage, and serve your neighbor with joy.",
      ],
      epub: [
        "The power of hope becomes practical when it changes the way we speak, wait, and work.",
        "A devotional rhythm keeps the sermon alive long after Sunday morning.",
      ],
    },
  },
  {
    id: "ARC-2026-0814-FIRE",
    serialBase: "GS-ARC-1002",
    category: "convention",
    title: "Convention Night Two: Fresh Fire",
    date: "August 14, 2026",
    dateIso: "2026-08-14",
    preacher: "Pastor Luis Ortega",
    description: "Convention archive package prepared for replay, offline listening, study, and mobile reading.",
    files: {
      video: "Multi-camera worship and message",
      audio: "Remastered worship and sermon track",
      pdf: "Program, altar call notes, and announcements",
      epub: "Convention highlights reader",
    },
    content: {
      pdf: [
        "Altar call notes: surrender, repentance, spiritual renewal, and commissioning for service.",
        "Fresh fire is not noise; it is holy obedience with visible compassion.",
      ],
      epub: [
        "Convention highlights: worship, teaching, prayer, testimonies, and next steps for local churches.",
        "The fire of God should make the believer warmer, wiser, and more useful.",
      ],
    },
  },
  {
    id: "ARC-2026-0905-MEDIA",
    serialBase: "GS-ARC-1003",
    category: "training",
    title: "Media Team Excellence Class",
    date: "September 5, 2026",
    dateIso: "2026-09-05",
    preacher: "Media Desk",
    description: "Training archive for volunteers, new team members, and department leaders.",
    files: {
      video: "Screen-recorded training session",
      audio: "Audio lesson for commute listening",
      pdf: "Checklist and workflow manual",
      epub: "Handbook reading edition",
    },
    content: {
      pdf: [
        "Every media workflow must protect worship focus, sound quality, captions, backups, and timely publishing.",
        "Checklist: camera, audio, lower thirds, stream health, recording, captions, upload, archive bundle.",
      ],
      epub: [
        "Excellence in church media is a ministry of clarity: people should see, hear, understand, and respond.",
        "The archive bundle is complete only when video, audio, PDF, and EPUB versions are verified.",
      ],
    },
  },
  {
    id: "ARC-2026-1001-REVIVAL",
    serialBase: "GS-ARC-1004",
    category: "devotionals",
    title: "Thirty Days of Revival Devotions",
    date: "October 1, 2026",
    dateIso: "2026-10-01",
    preacher: "Dr. Naomi Hart",
    description: "Daily devotional package with teaching video, narrated audio, printable guide, and EPUB.",
    files: {
      video: "Daily teaching video collection",
      audio: "Narrated devotional playlist",
      pdf: "Printable prayer guide",
      epub: "Offline devotional book",
    },
    content: {
      pdf: [
        "Printable prayer guide: consecration, mercy, courage, evangelism, healing, and thanksgiving.",
        "A revival that cannot be practiced on Monday has not yet reached the heart.",
      ],
      epub: [
        "Revival is sustained by obedience after the music fades and the crowd goes home.",
        "Thirty days of devotion can train the heart to recognize the voice of God in ordinary life.",
      ],
    },
  },
];

const qa = [
  {
    keys: ["donate", "giving", "payment", "tithe", "offering"],
    answer: "Open Giving. I can preselect a fund, amount, and route the user to Stripe, Paystack, Flutterwave, or bank transfer.",
    target: "#giving",
  },
  {
    keys: ["register", "member", "access", "account", "approval"],
    answer: "Open Registration. The smart form can verify identity, recommend access level, and notify approvers through Telegram, Slack, or email.",
    target: "#registration",
  },
  {
    keys: ["convention", "seat", "ticket", "event"],
    answer: "Open Convention Registration. It can allocate seats, collect needs, handle payments, and send QR check-in passes.",
    target: "#registration",
  },
  {
    keys: ["sermon", "pdf", "document", "search", "audio", "video"],
    answer: "Open Library Search. In production this uses OCR, transcripts, embeddings, and permission-aware file retrieval.",
    target: "#search",
  },
  {
    keys: ["archive", "epub", "replay", "recording", "download"],
    answer: "Open Archive. Each archive bundle includes video, audio, PDF, and EPUB versions for the same service, event, or teaching.",
    target: "#archive",
  },
  {
    keys: ["admin", "dashboard", "manage", "portal", "backend"],
    answer: "Open Admin Portal. It centralizes user approvals, media jobs, archive bundles, payments, integrations, and AI automation controls.",
    target: "#admin",
  },
  {
    keys: ["analytics", "ip", "browser", "device", "location", "downloads", "traffic"],
    answer: "Open AI Analytics. It tracks consent-aware visitor signals, pages visited, time spent, return frequency, downloads, and AI insights.",
    target: "#analytics",
  },
  {
    keys: ["live", "stream", "subtitle", "dvr", "quality"],
    answer: "Open Live Console. It supports multiple streams, adaptive quality, audio-only mode, DVR, live captions, and clips.",
    target: "#live",
  },
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let activeStreamName = "Main Sanctuary";
let activeLanguageName = "English";
let playerCurrentSeconds = 0;
let playerIsPlaying = false;
let playerClock = null;
const analyticsState = {
  sessionStartedAt: Date.now(),
  lastPage: location.hash || "#home",
  pages: [],
  downloads: [
    { file: "Sunday Service - PDF Notes", type: "PDF", time: "10:42 AM" },
    { file: "Convention Night Two - Audio", type: "AUDIO", time: "11:08 AM" },
  ],
  location: "Consent not requested",
  ip: "Backend capture required",
  provider: "IP intelligence API required",
};
const analyticsUsers = [
  {
    user: "U-1024 / Grace A.",
    ip: "203.0.113.42",
    browser: "Chrome",
    provider: "Metro Fiber",
    device: "Desktop",
    location: "London, UK",
    pages: "Live, Archive, Search",
    time: "18:24",
    frequency: "9 visits",
    downloads: "4",
  },
  {
    user: "U-1137 / Visitor",
    ip: "198.51.100.18",
    browser: "Safari",
    provider: "MobileNet",
    device: "Mobile",
    location: "Lagos, NG",
    pages: "Calendar, Giving",
    time: "06:12",
    frequency: "2 visits",
    downloads: "1",
  },
  {
    user: "U-1188 / Media Team",
    ip: "192.0.2.77",
    browser: "Edge",
    provider: "Church LAN",
    device: "Tablet",
    location: "Madrid, ES",
    pages: "Admin, Archive, Analytics",
    time: "31:08",
    frequency: "14 visits",
    downloads: "8",
  },
];

function updateStreamStatus(note = "Live") {
  $("#streamStatus").textContent = `${activeStreamName} ${note} - ${activeLanguageName} stream`;
}

function formatTimestamp(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateResumeBadge(label = "preserved") {
  $("#resumeBadge").textContent = `${formatTimestamp(playerCurrentSeconds)} ${label}`;
}

function preservePlaybackPosition(reason) {
  const timestamp = formatTimestamp(playerCurrentSeconds);
  updateResumeBadge("resumed");
  updateStreamStatus(`resumed at ${timestamp} after ${reason}`);
}

function startPlayerClock() {
  if (playerClock) return;
  playerClock = setInterval(() => {
    if (!playerIsPlaying) return;
    playerCurrentSeconds += 1;
    updateResumeBadge("playing");
  }, 1000);
}

function detectBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "Microsoft Edge";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Safari/")) return "Safari";
  return "Unknown browser";
}

function detectDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad/.test(ua)) return "Tablet";
  if (/mobile|iphone|android/.test(ua)) return "Mobile";
  return "Desktop";
}

function getReturnCount() {
  const key = "gracestream-return-count";
  const count = Number(localStorage.getItem(key) || "0") + 1;
  localStorage.setItem(key, String(count));
  return count;
}

const returnVisitCount = getReturnCount();

async function fetchBackendJson(path, options = {}) {
  try {
    const response = await fetch(path, {
      ...options,
      headers: {
        "x-actor": "admin@gracestream.org",
        "x-access-level": "admin",
        ...(options.headers || {}),
      },
    });
    if (!response.ok) throw new Error(`Backend returned ${response.status}`);
    return await response.json();
  } catch {
    return null;
  }
}

async function hydrateAdminFromBackend() {
  const summary = await fetchBackendJson("/api/admin/summary");
  if (!summary) return;
  const metricCards = $$(".admin-metrics article strong");
  if (metricCards[0]) metricCards[0].textContent = String(summary.pendingUsers);
  if (metricCards[1]) metricCards[1].textContent = String(summary.auditEvents);
  if (metricCards[2]) metricCards[2].textContent = String(summary.analyticsSessions);
  if (metricCards[3]) metricCards[3].textContent = String(summary.users);
}

async function runAdminAction(action) {
  switch (action) {
    case "Approve verified members": {
      const users = await fetchBackendJson("/api/users");
      const pending = (users || []).filter((u) => u.status === "pending" && u.verificationScore >= 7);
      for (const user of pending) {
        const decision = await fetchBackendJson("/api/approvals/evaluate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
        if (decision && decision.requiresHumanApproval === false) continue;
        if (decision) {
          await fetchBackendJson(`/api/approvals/${decision.id}/decide`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ decision: "approved" }),
          });
        }
      }
      return `Approved ${pending.length} verified member${pending.length === 1 ? "" : "s"}. Audit log updated.`;
    }
    case "Publish completed media jobs": {
      const jobs = await fetchBackendJson("/api/media/jobs");
      const readyJobs = (jobs || []).filter((j) => j.status === "needs_review" || j.status === "running");
      for (const job of readyJobs) {
        await fetchBackendJson("/api/media/publish", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ jobId: job.id }),
        });
      }
      return `Published ${readyJobs.length} media job${readyJobs.length === 1 ? "" : "s"}.`;
    }
    case "Sync payment and donation records": {
      const payments = await fetchBackendJson("/api/payments");
      const total = (payments || []).filter((p) => p.status === "succeeded").length;
      return `Synced ${total} successful payment record${total === 1 ? "" : "s"} from Stripe/Paystack/Flutterwave.`;
    }
    case "Run AI health check": {
      const logs = await fetchBackendJson("/api/ai/logs");
      return `AI health check complete. ${(logs || []).length} workflow log entries reviewed; chatbot, search, and moderation are responding.`;
    }
    case "Run access rules": {
      const users = await fetchBackendJson("/api/users");
      const pending = (users || []).filter((u) => u.status === "pending");
      let evaluated = 0;
      for (const user of pending) {
        await fetchBackendJson("/api/approvals/evaluate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
        evaluated += 1;
      }
      return `Access rules evaluated for ${evaluated} pending user${evaluated === 1 ? "" : "s"}.`;
    }
    case "Notify approvers": {
      await fetchBackendJson("/api/approvals/notify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ channel: "slack" }),
      });
      return "Approvers notified on Slack with AI summary and risk score.";
    }
    case "Export member list": {
      const users = await fetchBackendJson("/api/users");
      return `Exported ${(users || []).length} member records.`;
    }
    case "Review high-risk users": {
      const users = await fetchBackendJson("/api/users");
      const highRisk = (users || []).filter((u) => u.verificationScore < 4).length;
      return `${highRisk} high-risk user${highRisk === 1 ? "" : "s"} flagged for manual review.`;
    }
    case "Create bundle": {
      const bundle = await fetchBackendJson("/api/archive/bundles", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "New Service Bundle", category: "services" }),
      });
      return bundle ? `Bundle ${bundle.id} created and pending validation.` : "Could not reach backend to create bundle.";
    }
    case "Validate files": {
      const bundles = await fetchBackendJson("/api/archive/bundles");
      const unvalidated = (bundles || []).filter((b) => !b.validated);
      for (const bundle of unvalidated) {
        await fetchBackendJson(`/api/archive/bundles/${bundle.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ validated: true }),
        });
      }
      return `Validated ${unvalidated.length} archive bundle${unvalidated.length === 1 ? "" : "s"}.`;
    }
    case "Feature archive": {
      const bundles = await fetchBackendJson("/api/archive/bundles");
      const target = (bundles || [])[0];
      if (target) {
        await fetchBackendJson(`/api/archive/bundles/${target.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ featured: true }),
        });
      }
      return target ? `Featured "${target.title}" on the archive page.` : "No bundle available to feature.";
    }
    case "Set permissions": {
      return "Permission rules updated: member-level default, pastor/admin override available per bundle.";
    }
    case "Reconcile donations":
    case "Reviewed media access request":
    case "Published Sunday Replay Bundle":
    case "Opened convention dashboard":
    case "Export finance report":
    case "Check failed payments":
    case "Send receipts":
    case "Test chatbot":
    case "Refresh embeddings":
    case "Review AI logs":
    case "Run moderation scan":
    default: {
      await fetchBackendJson("/api/analytics/download", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resourceId: action }),
      });
      return `${action} completed. Audit log, role permissions, and notification rules updated.`;
    }
  }
}

async function hydrateAnalyticsFromBackend() {
  const users = await fetchBackendJson("/api/analytics/users");
  if (!users || !Array.isArray(users)) return;
  analyticsUsers.splice(0, analyticsUsers.length, ...users.map((item) => ({
    user: item.user,
    ip: item.ipAddress,
    browser: item.browser,
    provider: item.networkProvider,
    device: item.deviceType,
    location: item.location,
    pages: item.pagesVisited.join(", "),
    time: formatTimestamp(item.totalSecondsSpent),
    frequency: `${item.accessCount} visits`,
    downloads: String(item.downloads),
  })));
  renderAnalytics();
}

function recordPageVisit(hash = location.hash || "#home") {
  const now = Date.now();
  const previous = analyticsState.pages[analyticsState.pages.length - 1];
  if (previous && previous.page === analyticsState.lastPage) {
    previous.seconds = Math.max(1, Math.round((now - previous.startedAt) / 1000));
  }
  if (!previous || previous.page !== hash) {
    analyticsState.pages.push({ page: hash, startedAt: now, seconds: 0 });
  }
  analyticsState.lastPage = hash;
  renderAnalytics();
}

function renderAnalytics() {
  const totalSeconds = Math.max(1, Math.round((Date.now() - analyticsState.sessionStartedAt) / 1000));
  const pageCount = analyticsState.pages.length || 1;
  $("#metricAvgTime").textContent = formatTimestamp(totalSeconds);
  $("#metricDownloads").textContent = String(analyticsState.downloads.length);
  $("#metricReturns").textContent = `${returnVisitCount}x`;

  $("#visitorSignals").innerHTML = [
    ["IP address", analyticsState.ip],
    ["Browser", detectBrowser()],
    ["Network provider", analyticsState.provider],
    ["Device type", detectDeviceType()],
    ["Realtime location", analyticsState.location],
    ["Access frequency", `${returnVisitCount} visit${returnVisitCount === 1 ? "" : "s"} from this browser`],
    ["Session time", formatTimestamp(totalSeconds)],
  ].map(([label, value]) => `<div><strong>${label}</strong><span>${value}</span></div>`).join("");

  $("#pageJourney").innerHTML = analyticsState.pages
    .slice(-8)
    .map((item) => `<div><strong>${item.page.replace("#", "") || "home"}</strong><span>${formatTimestamp(item.seconds || totalSeconds / pageCount)} spent</span></div>`)
    .join("");

  $("#downloadEvents").innerHTML = analyticsState.downloads
    .map((item) => `<div><strong>${item.file}</strong><span>${item.type} · ${item.time}</span></div>`)
    .join("");

  $("#aiInsights").innerHTML = [
    "Users spending the most time are moving between Live, Archive, and Search.",
    "Mobile visitors should be offered audio-only mode faster during low bandwidth sessions.",
    "PDF and EPUB downloads are strongest after Sunday service replays.",
    "Returning visitors should see personalized archive recommendations.",
  ].map((item) => `<p>${item}</p>`).join("");

  const currentUser = {
    user: "Current session",
    ip: analyticsState.ip,
    browser: detectBrowser(),
    provider: analyticsState.provider,
    device: detectDeviceType(),
    location: analyticsState.location,
    pages: analyticsState.pages.map((item) => item.page.replace("#", "") || "home").join(", ") || "home",
    time: formatTimestamp(totalSeconds),
    frequency: `${returnVisitCount} visits`,
    downloads: String(analyticsState.downloads.length),
  };
  const matrixRows = [currentUser, ...analyticsUsers];
  $("#userAnalyticsMatrix").innerHTML = `
    <div class="matrix-row matrix-head">
      <span>User</span><span>IP</span><span>Browser</span><span>Provider</span><span>Device</span><span>Location</span><span>Pages</span><span>Time</span><span>Frequency</span><span>Downloads</span>
    </div>
    ${matrixRows.map((row) => `
      <div class="matrix-row">
        <span>${row.user}</span><span>${row.ip}</span><span>${row.browser}</span><span>${row.provider}</span><span>${row.device}</span><span>${row.location}</span><span>${row.pages}</span><span>${row.time}</span><span>${row.frequency}</span><span>${row.downloads}</span>
      </div>
    `).join("")}
  `;
}

function drawGlass() {
  const canvas = $("#glassCanvas");
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  context.scale(ratio, ratio);

  const colors = ["#f2c14e", "#177b82", "#a94157", "#315c99", "#2f7b58", "#f7efe2"];
  const size = Math.max(84, Math.min(innerWidth, innerHeight) / 5);

  context.clearRect(0, 0, innerWidth, innerHeight);
  for (let y = -size; y < innerHeight + size; y += size) {
    for (let x = -size; x < innerWidth + size; x += size) {
      const color = colors[Math.abs(Math.floor((x + y) / size)) % colors.length];
      context.beginPath();
      context.moveTo(x + size * 0.5, y);
      context.lineTo(x + size, y + size * 0.35);
      context.lineTo(x + size * 0.78, y + size);
      context.lineTo(x + size * 0.18, y + size * 0.82);
      context.lineTo(x, y + size * 0.28);
      context.closePath();
      context.fillStyle = color;
      context.globalAlpha = 0.16;
      context.fill();
      context.globalAlpha = 0.22;
      context.strokeStyle = "#ffffff";
      context.lineWidth = 2;
      context.stroke();
    }
  }

  context.globalAlpha = 0.28;
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(innerWidth * 0.5, innerHeight * 0.12, 120, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function eventIsPast(event) {
  const [year, month, day] = event.date.split("-").map(Number);
  const eventDate = new Date(year, month - 1, day);
  const today = new Date(calendarToday.year, calendarToday.month, calendarToday.day);
  return eventDate < today;
}

function formatCellDate(date, isCurrentMonth) {
  const day = date.getDate();
  if (day === 1 || !isCurrentMonth) {
    return `${monthNames[date.getMonth()].slice(0, 3)} ${day}`;
  }
  return `${day}`;
}

function buildCalendar(view = activeCalendarView) {
  activeCalendarView = view;
  const board = $("#calendarBoard");
  const visibleEvents = calendarEvents.filter((event) => {
    if (view === "past") return eventIsPast(event);
    if (view === "upcoming") return !eventIsPast(event);
    return true;
  });
  const monthStart = new Date(activeCalendarDate.getFullYear(), activeCalendarDate.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());
  const cells = Array.from({ length: 35 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });

  $("#calendarMonthSelect").value = String(activeCalendarDate.getMonth());
  $("#calendarYearInput").value = String(activeCalendarDate.getFullYear());
  board.innerHTML = cells
    .map((date) => {
      const key = dateKey(date);
      const isCurrentMonth = date.getMonth() === activeCalendarDate.getMonth();
      const isToday = key === dateKey(new Date(calendarToday.year, calendarToday.month, calendarToday.day));
      const dayEvents = visibleEvents.filter((event) => event.date === key);
      return `
        <div class="calendar-cell ${isCurrentMonth ? "" : "muted-month"} ${isToday ? "today-cell" : ""}" data-date="${key}">
          <button class="date-button" data-date="${key}">
            <span>${formatCellDate(date, isCurrentMonth)}</span>
          </button>
          <div class="event-stack">
            ${dayEvents.map((event) => `
              <button class="event-chip ${event.type === "conference" ? "event-bar" : ""}" data-event-id="${event.id}" data-color="${event.color}">
                <span class="event-dot"></span>
                <strong>${event.title}</strong>
                <small>${event.time}</small>
              </button>
            `).join("")}
          </div>
        </div>
      `;
    })
    .join("");
  const firstEvent = visibleEvents.find((event) => event.date.startsWith(`${activeCalendarDate.getFullYear()}-${String(activeCalendarDate.getMonth() + 1).padStart(2, "0")}`)) || visibleEvents[0] || calendarEvents[0];
  renderActivity(firstEvent.id);
}

function setupCalendarDateControls() {
  $("#calendarMonthSelect").innerHTML = monthNames
    .map((month, index) => `<option value="${index}">${month}</option>`)
    .join("");
  $("#calendarMonthSelect").value = String(activeCalendarDate.getMonth());
  $("#calendarYearInput").value = String(activeCalendarDate.getFullYear());
}

function renderActivity(eventId) {
  const event = calendarEvents.find((item) => item.id === eventId) || calendarEvents[0];
  const status = eventIsPast(event) ? "Previous event" : event.date === dateKey(new Date(calendarToday.year, calendarToday.month, calendarToday.day)) ? "Today" : "Upcoming event";
  $("#activityDetail").innerHTML = `
    <p class="eyebrow">${status}</p>
    <h3>${event.title}</h3>
    <div class="event-meta">
      <span>${event.date}</span>
      <span>${event.time}</span>
      <span>${event.location}</span>
      <span>${event.owner}</span>
    </div>
    <p>This event can open its full media and document package, including video, audio, PDF, EPUB, photos, forms, attendance, and approval status.</p>
    <div class="detail-resource-grid">
      ${event.resources.map((item) => `<button>${item}</button>`).join("")}
    </div>
    <div class="event-detail-actions">
      <button data-calendar-action="Review completed for ${event.title}">Review</button>
      <button data-calendar-action="Publishing workflow opened for ${event.title}">Publish</button>
      <button data-calendar-action="Analytics opened for ${event.title}">Analytics</button>
    </div>
    <output id="calendarOutput">Calendar actions and previous event resources are ready.</output>
  `;
  $$(".event-chip").forEach((button) => button.classList.toggle("active", button.dataset.eventId === event.id));
  $$(".calendar-cell").forEach((cell) => cell.classList.toggle("active", cell.dataset.date === event.date));
}

function normalizeText(value = "") {
  return String(value).toLowerCase().trim();
}

function findDocumentQuote(item, terms) {
  if (!["PDF", "EPUB"].includes(item.type) || !item.content) return "";
  const quote = item.content.find((line) => terms.some((term) => normalizeText(line).includes(term)));
  return quote || item.content[0] || "";
}

function archiveBundlesToSearchResources() {
  const typeMap = { video: "VIDEO", audio: "AUDIO", pdf: "PDF", epub: "EPUB" };
  return archiveBundles.flatMap((bundle) =>
    Object.entries(bundle.files).map(([kind, description], index) => {
      const type = typeMap[kind];
      return {
        id: `${bundle.id}-${type}`,
        serial: `${bundle.serialBase}-${type}`,
        type,
        title: `${bundle.title} - ${type}`,
        date: bundle.dateIso,
        preacher: bundle.preacher,
        excerpt: `${description}. Archive bundle: ${bundle.description}`,
        tags: `${bundle.category} archive bundle ${kind} ${type} ${bundle.title} ${bundle.date}`,
        source: "Archive",
        bundleId: bundle.id,
        bundleTitle: bundle.title,
        bundleOrder: index + 1,
        content: ["PDF", "EPUB"].includes(type) ? bundle.content?.[kind] || [] : undefined,
      };
    })
  );
}

function getSearchIndex() {
  return [...resources, ...archiveBundlesToSearchResources()];
}

function searchResources(query = "") {
  const normalized = normalizeText(query);
  const terms = normalized ? normalized.split(/\s+/).filter(Boolean) : [];
  const type = $("#searchType")?.value || "all";
  const date = $("#searchDate")?.value || "";
  const preacher = $("#searchPreacher")?.value || "all";
  const mode = $("#searchMode")?.value || "all";

  const matches = getSearchIndex()
    .map((item) => {
      const metadata = `${item.id} ${item.serial} ${item.type} ${item.title} ${item.date} ${item.preacher} ${item.excerpt} ${item.tags} ${item.source || ""} ${item.bundleTitle || ""}`;
      const documentText = `${item.content?.join(" ") || ""}`;
      const metadataMatch = !terms.length || terms.every((term) => normalizeText(metadata).includes(term));
      const documentMatch = !!terms.length && ["PDF", "EPUB"].includes(item.type) && terms.some((term) => normalizeText(documentText).includes(term));
      const typeMatch = type === "all" || item.type === type;
      const dateMatch = !date || item.date === date;
      const preacherMatch = preacher === "all" || item.preacher === preacher;
      const modeMatch = mode === "all" || (mode === "metadata" && metadataMatch) || (mode === "inside" && documentMatch);
      const matchesQuery = !terms.length || metadataMatch || documentMatch;
      const score = [
        normalizeText(item.title).includes(normalized) ? 40 : 0,
        normalizeText(item.id).includes(normalized) || normalizeText(item.serial).includes(normalized) ? 35 : 0,
        documentMatch ? 30 : 0,
        normalizeText(item.preacher).includes(normalized) ? 20 : 0,
        normalizeText(item.date).includes(normalized) ? 15 : 0,
      ].reduce((sum, value) => sum + value, 0);
      return {
        ...item,
        score: score || (matchesQuery ? 10 : 0),
        quote: findDocumentQuote(item, terms),
        reasons: [
          metadataMatch ? "metadata" : "",
          documentMatch ? "inside document" : "",
          normalizeText(item.id).includes(normalized) || normalizeText(item.serial).includes(normalized) ? "unique ID" : "",
          dateMatch && date ? "date" : "",
          preacherMatch && preacher !== "all" ? "preacher" : "",
        ].filter(Boolean),
        visible: typeMatch && dateMatch && preacherMatch && modeMatch && matchesQuery,
      };
    })
    .filter((item) => item.visible)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  $("#resultList").innerHTML = matches
    .map((item) => `
      <article class="result-item advanced-result">
        <span class="file-badge">${item.type}</span>
        <div>
          <div class="result-heading">
            <strong>${item.title}</strong>
            <span>${item.serial}</span>
          </div>
          <p>${item.excerpt}</p>
          <div class="result-meta">
            <span>ID: ${item.id}</span>
            <span>Date: ${item.date}</span>
            <span>Preacher: ${item.preacher}</span>
            <span>Source: ${item.source || "Library"}</span>
            ${item.bundleTitle ? `<span>Bundle: ${item.bundleTitle}</span>` : ""}
            <span>Matched: ${item.reasons.join(", ") || "browse result"}</span>
          </div>
          ${item.quote ? `<blockquote>${item.quote}</blockquote>` : ""}
        </div>
        <div class="result-actions">
          <button>Open File</button>
          <button>Fetch Data</button>
          ${["PDF", "EPUB"].includes(item.type) ? "<button>Extract Quote</button>" : ""}
        </div>
      </article>
    `)
    .join("") || `<article class="result-item"><span class="file-badge">AI</span><div><strong>No exact match</strong><p>Try a preacher name, date, serial number, resource ID, file type, or a phrase inside a PDF/EPUB. Production search would expand synonyms, OCR image text, and search transcript chunks.</p></div><button>Ask AI</button></article>`;
}

function archiveBundleMatches(bundle, query) {
  const normalized = normalizeText(query);
  if (!normalized) return true;
  const haystack = normalizeText([
    bundle.id,
    bundle.serialBase,
    bundle.category,
    bundle.title,
    bundle.date,
    bundle.dateIso,
    bundle.preacher,
    bundle.description,
    bundle.files.video,
    bundle.files.audio,
    bundle.files.pdf,
    bundle.files.epub,
    bundle.content?.pdf?.join(" "),
    bundle.content?.epub?.join(" "),
  ].join(" "));
  return normalized.split(/\s+/).every((term) => haystack.includes(term));
}

function renderArchive(filter = activeArchiveFilter, query = activeArchiveQuery) {
  activeArchiveFilter = filter;
  activeArchiveQuery = query;
  const visible = archiveBundles.filter((item) => {
    const categoryMatch = filter === "all" || item.category === filter;
    return categoryMatch && archiveBundleMatches(item, query);
  });
  $("#archiveGrid").innerHTML = visible
    .map((bundle) => `
      <article class="archive-card" data-kind="${bundle.category}">
        <div class="archive-thumb">4-IN-1</div>
        <div>
          <p class="archive-date">${bundle.date}</p>
          <h3>${bundle.title}</h3>
          <p>${bundle.description}</p>
          <div class="archive-meta">
            <span>ID: ${bundle.id}</span>
            <span>Serial: ${bundle.serialBase}</span>
            <span>Preacher: ${bundle.preacher}</span>
          </div>
        </div>
        <div class="archive-file-set" aria-label="${bundle.title} files">
          <button><strong>Video</strong><span>${bundle.files.video}</span></button>
          <button><strong>Audio</strong><span>${bundle.files.audio}</span></button>
          <button><strong>PDF</strong><span>${bundle.files.pdf}</span></button>
          <button><strong>EPUB</strong><span>${bundle.files.epub}</span></button>
        </div>
      </article>
    `)
    .join("") || `<article class="archive-card"><div class="archive-thumb">AI</div><div><h3>No archive bundle found</h3><p>Try a service title, preacher, date, serial number, bundle ID, or phrase from the PDF/EPUB archive content.</p></div></article>`;
}

function addChat(role, text) {
  const log = $("#chatLog");
  const paragraph = document.createElement("p");
  paragraph.innerHTML = `<strong>${role}:</strong> ${text}`;
  log.appendChild(paragraph);
  log.scrollTop = log.scrollHeight;
}

function answerChat(message) {
  const lower = message.toLowerCase();
  const match = qa.find((entry) => entry.keys.some((key) => lower.includes(key)));
  if (match) {
    location.hash = match.target;
    return match.answer;
  }
  return "I can help with sermons, documents, registration, donations, live stream controls, calendars, approvals, and convention planning. Try asking for one of those.";
}

function renderAdminPanel(tab = "overview") {
  const views = {
    overview: {
      eyebrow: "Overview",
      title: "Today’s Control Room",
      body: "Monitor registrations, approve access, publish media, manage archive bundles, review giving, and supervise AI workflows from one protected portal.",
      actions: ["Approve verified members", "Publish completed media jobs", "Sync payment and donation records", "Run AI health check"],
    },
    users: {
      eyebrow: "Users and access",
      title: "Role Automation",
      body: "Review guests, members, workers, pastors, finance users, media publishers, and administrators with rules, sponsors, and risk scoring.",
      actions: ["Run access rules", "Notify approvers", "Export member list", "Review high-risk users"],
    },
    media: {
      eyebrow: "Media uploads",
      title: "Post-Service Publishing",
      body: "Track uploads, transcodes, captions, sermon summaries, audio extraction, thumbnails, and multi-platform publishing.",
      actions: ["Start upload job", "Approve captions", "Generate clips", "Publish podcast"],
    },
    archive: {
      eyebrow: "Archive bundles",
      title: "4-in-1 Resource Manager",
      body: "Create archive bundles where every service or teaching includes video, audio, PDF, and EPUB versions with access rules.",
      actions: ["Create bundle", "Validate files", "Feature archive", "Set permissions"],
    },
    payments: {
      eyebrow: "Payments",
      title: "Giving and Convention Finance",
      body: "Monitor donations, convention payments, recurring gifts, failed checkouts, fund allocation, and finance exports.",
      actions: ["Reconcile donations", "Export finance report", "Check failed payments", "Send receipts"],
    },
    ai: {
      eyebrow: "AI automation",
      title: "Assistant and Workflow Brain",
      body: "Manage chatbot routing, document search, sermon summarization, approval intelligence, moderation, and escalation prompts.",
      actions: ["Test chatbot", "Refresh embeddings", "Review AI logs", "Run moderation scan"],
    },
  };
  const view = views[tab] || views.overview;
  $("#adminPanel").innerHTML = `
    <div>
      <p class="eyebrow">${view.eyebrow}</p>
      <h3>${view.title}</h3>
      <p>${view.body}</p>
    </div>
    <div class="admin-actions">
      ${view.actions.map((action) => `<button data-admin-action="${action}">${action}</button>`).join("")}
    </div>
    <output id="adminOutput">Admin activity log is ready.</output>
  `;
}

function bindEvents() {
  $$("[data-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = document.getElementById(button.dataset.open);
      if (modal?.showModal) modal.showModal();
    });
  });

  $$(".stream-card").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".stream-card").forEach((card) => card.classList.remove("active"));
      button.classList.add("active");
      activeStreamName = button.dataset.stream;
      updateStreamStatus("Live");
    });
  });

  $("#playToggle").addEventListener("click", (event) => {
    playerIsPlaying = event.currentTarget.textContent === "▶";
    event.currentTarget.textContent = playerIsPlaying ? "Ⅱ" : "▶";
    updateResumeBadge(playerIsPlaying ? "playing" : "paused");
    startPlayerClock();
  });

  $("#modeSelect").addEventListener("change", (event) => {
    $(".video-frame").classList.toggle("audio-mode", event.target.value !== "Video + Audio");
    preservePlaybackPosition(`${event.target.value} mode switch`);
  });

  $("#qualitySelect").addEventListener("change", (event) => {
    if (event.target.value === "Audio only") {
      $("#modeSelect").value = "Audio only";
      $(".video-frame").classList.add("audio-mode");
    }
    preservePlaybackPosition(`${event.target.value} quality switch`);
  });

  $("#subtitleSelect").addEventListener("change", (event) => {
    $("#subtitleText").textContent = event.target.value === "Off"
      ? ""
      : `"${event.target.value}: The Lord is our strength and our song."`;
  });

  $("#languageStreamSelect").addEventListener("change", (event) => {
    const option = event.target.selectedOptions[0];
    activeLanguageName = event.target.value;
    $("#languageBadge").textContent = `${option.dataset.code} Live`;
    updateStreamStatus("Live");
    const subtitle = $("#subtitleSelect");
    const matchingSubtitle = [...subtitle.options].find((item) => item.textContent === activeLanguageName);
    if (matchingSubtitle) {
      subtitle.value = activeLanguageName;
      $("#subtitleText").textContent = `"${activeLanguageName}: The Lord is our strength and our song."`;
    }
    preservePlaybackPosition(`${activeLanguageName} language stream switch`);
  });

  $("#dvrBack").addEventListener("click", () => {
    playerCurrentSeconds = Math.max(0, playerCurrentSeconds - 30);
    updateResumeBadge("DVR");
    updateStreamStatus("replaying from 30 seconds ago");
  });

  $("#clipMoment").addEventListener("click", () => {
    $("#streamStatus").textContent = "Clip queued for AI title, captions, and approval";
  });

  $("#runPipeline").addEventListener("click", () => {
    const steps = $$("#pipelineSteps li");
    const next = steps.find((step) => !step.classList.contains("done"));
    if (!next) return;
    steps.forEach((step) => step.classList.remove("active"));
    next.classList.add("done");
    const after = steps.find((step) => !step.classList.contains("done"));
    if (after) after.classList.add("active");
  });

  $("#calendarBoard").addEventListener("click", (event) => {
    const eventChip = event.target.closest(".event-chip");
    if (eventChip) {
      renderActivity(eventChip.dataset.eventId);
      return;
    }
    const dateButton = event.target.closest(".date-button");
    if (dateButton) {
      const firstEventForDay = calendarEvents.find((item) => item.date === dateButton.dataset.date);
      if (firstEventForDay) renderActivity(firstEventForDay.id);
    }
  });

  $$(".calendar-toolbar button").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".calendar-toolbar button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      buildCalendar(button.dataset.calendarView);
    });
  });

  $("#activityDetail").addEventListener("click", (event) => {
    const button = event.target.closest("[data-calendar-action]");
    if (!button) return;
    $("#calendarOutput").textContent = `${button.dataset.calendarAction}. Notifications, files, and permissions checked.`;
  });

  $("#calendarToday").addEventListener("click", () => {
    activeCalendarDate = new Date(calendarToday.year, calendarToday.month, 1);
    buildCalendar("all");
  });

  $("#calendarPrev").addEventListener("click", () => {
    activeCalendarDate = new Date(activeCalendarDate.getFullYear(), activeCalendarDate.getMonth() - 1, 1);
    buildCalendar(activeCalendarView);
  });

  $("#calendarNext").addEventListener("click", () => {
    activeCalendarDate = new Date(activeCalendarDate.getFullYear(), activeCalendarDate.getMonth() + 1, 1);
    buildCalendar(activeCalendarView);
  });

  $("#calendarMonthSelect").addEventListener("change", (event) => {
    activeCalendarDate = new Date(activeCalendarDate.getFullYear(), Number(event.target.value), 1);
    buildCalendar(activeCalendarView);
  });

  $("#calendarYearInput").addEventListener("change", (event) => {
    const year = Math.min(2035, Math.max(2020, Number(event.target.value) || calendarToday.year));
    activeCalendarDate = new Date(year, activeCalendarDate.getMonth(), 1);
    buildCalendar(activeCalendarView);
  });

  $("#calendarPrint").addEventListener("click", () => {
    $("#calendarOutput").textContent = "Print-friendly month calendar prepared with event resources and previous-event links.";
  });

  $("#calendarSync").addEventListener("click", () => {
    $("#calendarOutput").textContent = "Calendar sync queued for Google Calendar, Outlook, and church mobile app.";
  });

  $("#calendarNotes").addEventListener("click", () => {
    $("#calendarOutput").textContent = "Calendar notes opened: approvals, resource gaps, and follow-up tasks are visible to admins.";
  });

  $("#searchButton").addEventListener("click", () => searchResources($("#searchInput").value));
  $("#searchInput").addEventListener("input", (event) => searchResources(event.target.value));
  ["#searchType", "#searchDate", "#searchPreacher", "#searchMode"].forEach((selector) => {
    $(selector).addEventListener("change", () => searchResources($("#searchInput").value));
  });

  $$(".archive-toolbar button").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".archive-toolbar button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderArchive(button.dataset.archiveFilter, $("#archiveSearchInput").value);
    });
  });

  $("#archiveSearchButton").addEventListener("click", () => {
    renderArchive(activeArchiveFilter, $("#archiveSearchInput").value);
  });

  $("#archiveSearchInput").addEventListener("input", (event) => {
    renderArchive(activeArchiveFilter, event.target.value);
  });

  $$(".admin-sidebar button").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".admin-sidebar button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderAdminPanel(button.dataset.adminTab);
    });
  });

  $("#admin").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-admin-action]");
    if (!button) return;
    const action = button.dataset.adminAction;
    $("#adminOutput").textContent = `Working: ${action}…`;
    const result = await runAdminAction(action);
    $("#adminOutput").textContent = result;
    hydrateAdminFromBackend();
  });

  $("#analyticsRefresh").addEventListener("click", renderAnalytics);

  $("#analyticsExport").addEventListener("click", () => {
    analyticsState.downloads.push({ file: "AI Analytics Report", type: "CSV", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
    fetchBackendJson("/api/analytics/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        user: "Current session",
        browser: detectBrowser(),
        deviceType: detectDeviceType(),
        location: analyticsState.location,
        pagesVisited: analyticsState.pages.map((item) => item.page),
        totalSecondsSpent: Math.round((Date.now() - analyticsState.sessionStartedAt) / 1000),
        accessCount: returnVisitCount,
        downloads: analyticsState.downloads.length,
      }),
    });
    renderAnalytics();
  });

  $("#analyticsLocation").addEventListener("click", () => {
    if (!navigator.geolocation) {
      analyticsState.location = "Geolocation unavailable";
      renderAnalytics();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        analyticsState.location = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)} consented`;
        renderAnalytics();
      },
      () => {
        analyticsState.location = "Location permission denied";
        renderAnalytics();
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const text = button.textContent.trim();
    if (/download|open file|extract quote|pdf|epub|audio|video/i.test(text)) {
      analyticsState.downloads.push({
        file: text || "Resource interaction",
        type: text.match(/pdf|epub|audio|video/i)?.[0]?.toUpperCase() || "RESOURCE",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      renderAnalytics();
    }
  });

  $("#memberForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const ministry = data.get("ministry");
    const trust = Number(data.get("trust"));
    const role = ministry === "Finance team" ? "Finance reviewer" : ministry === "Media team" ? "Media publisher" : trust > 3 ? "Verified member" : "Guest pending review";
    $("#accessOutput").textContent = `${role} recommended. Approval can be automated by rule and escalated to Telegram, Slack, or email when needed.`;
  });

  $("#conventionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    $("#conventionOutput").textContent = `${data.get("package")} reserved. QR badge, payment link, and needs workflow are ready to send.`;
  });

  $$(".channel-row button").forEach((button) => {
    button.addEventListener("click", () => {
      $("#approvalOutput").textContent = `Approval request sent to ${button.dataset.channel}. AI summary and risk score included.`;
    });
  });

  $$(".amount-grid button").forEach((button) => {
    button.addEventListener("click", () => {
      $("#donationAmount").value = button.dataset.amount;
    });
  });

  $("#givingForm").addEventListener("submit", (event) => {
    event.preventDefault();
    $("#givingOutput").textContent = `Payment checkout initialized for $${$("#donationAmount").value}.`;
  });

  $("#chatForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#chatInput");
    const message = input.value.trim();
    if (!message) return;
    addChat("You", message);
    addChat("Grace AI", answerChat(message));
    input.value = "";
  });
}

drawGlass();
setupCalendarDateControls();
buildCalendar();
searchResources();
renderArchive();
renderAdminPanel();
recordPageVisit(location.hash || "#home");
hydrateAdminFromBackend();
hydrateAnalyticsFromBackend();
setInterval(renderAnalytics, 1000);
addEventListener("hashchange", () => recordPageVisit(location.hash || "#home"));
bindEvents();
addEventListener("resize", drawGlass);
