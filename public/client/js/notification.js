console.log("✅ notification.js loaded");

/**
 * ================================
 * HELPER: MAP LINK BY TYPE
 * ================================
 */
function resolveNotificationLink(data) {
  switch (data.type) {
    case "PROPOSAL_CREATE":
      return `/hirer/projects/${data.projectId}/proposals`;

    case "PROPOSAL_ACCEPTED":
      return `/freelancer/jobs`;

    case "PROPOSAL_REJECTED":
      return `/freelancer/proposals`;

    case "PROGRESS_UPDATE":
      return `/hirer/jobs`;

    case "JOB_COMPLETED":
      return `/freelancer/history`;

    default:
      return "javascript:void(0)";
  }
}

/**
 * ================================
 * SOCKET → FRONTEND EVENT
 * ================================
 */
window.addEventListener("NEW_NOTIFICATION", function (e) {
  const data = e.detail;

  // BẮT BUỘC PHẢI CÓ TYPE
  if (!data || !data.type) {
    console.warn("⚠️ Notification missing type:", data);
    return;
  }

  showToastNotification(data);
  addNotificationToDropdown(data);
  increaseBadge();
});

/**
 * ================================
 * TOAST UI
 * ================================
 */
function showToastNotification(data) {
  const toast = document.createElement("div");
  toast.className = "notify-toast";

  toast.innerHTML = `
    <div class="notify-title">${data.title || "Notification"}</div>
    <div class="notify-content">${data.message || data.content || ""}</div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * ================================
 * DROPDOWN + BADGE
 * ================================
 */
let unreadCount = 0;

function addNotificationToDropdown(data) {
  const dropdown = document.getElementById("notify-list");
  if (!dropdown) return;

  console.log("🔔 Render notification:", data);

  // Tránh render trùng
  if (data._id) {
    const exists = dropdown.querySelector(
      `.notify-item[data-id="${data._id}"]`
    );
    if (exists) return;
  }

  const empty = document.querySelector("#notify-dropdown .notify-empty");
  if (empty) empty.remove();

  const item = document.createElement("a");
  item.className = `dropdown-item notify-item ${
    data.isRead ? "read" : "unread"
  }`;
  item.dataset.id = data._id || "";

  item.href = resolveNotificationLink(data);

  item.innerHTML = `
    <strong>${data.title || "Notification"}</strong>
    <div style="font-size:13px">
      ${data.message || data.content || ""}
    </div>
    <small class="text-muted">${new Date().toLocaleString()}</small>
  `;

  const li = document.createElement("li");
  li.appendChild(item);
  dropdown.prepend(li);
}

function increaseBadge() {
  unreadCount++;
  renderBadge();
}

function renderBadge() {
  const badge = document.getElementById("notify-badge");
  if (!badge) return;

  if (unreadCount > 0) {
    badge.innerText = unreadCount;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}

/**
 * ================================
 * LOAD NOTIFICATION FROM DB
 * ================================
 */
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const res = await fetch("/client");
    if (!res.ok) throw new Error("Fetch notification failed");

    const list = await res.json();
    if (!Array.isArray(list)) return;

    list.forEach((n) => {
      addNotificationToDropdown({
        _id: n._id,
        type: n.type,              // ✅ CỰC KỲ QUAN TRỌNG
        title: n.title,
        content: n.content,
        projectId: n.projectId,
        isRead: n.isRead,
      });

      if (!n.isRead) unreadCount++;
    });

    renderBadge();
  } catch (err) {
    console.error("❌ Load notification error:", err);
  }
});

/**
 * ================================
 * CLICK → MARK AS READ
 * ================================
 */
document.addEventListener("click", async function (e) {
  const notifyItem = e.target.closest(".notify-item");
  if (!notifyItem) return;

  const notifyId = notifyItem.dataset.id;
  if (!notifyId) return;

  if (notifyItem.classList.contains("read")) return;
  if (notifyItem.dataset.loading === "true") return;

  notifyItem.dataset.loading = "true";

  try {
    const res = await fetch(`/client/notifications/${notifyId}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Mark read failed");

    notifyItem.classList.remove("unread");
    notifyItem.classList.add("read");

    unreadCount = Math.max(unreadCount - 1, 0);
    renderBadge();
  } catch (error) {
    console.error("❌ Read notification error:", error);
    delete notifyItem.dataset.loading;
  }
});

/**
 * ================================
 * REALTIME SYNC READ
 * ================================
 */
window.addEventListener("SYNC_NOTIFICATION_READ", function (e) {
  const { notificationId } = e.detail;

  const item = document.querySelector(
    `.notify-item[data-id="${notificationId}"]`
  );

  if (!item) return;

  if (item.classList.contains("unread")) {
    item.classList.remove("unread");
    item.classList.add("read");

    unreadCount = Math.max(unreadCount - 1, 0);
    renderBadge();
  }
});

/**
 * ================================
 * CLEAR ALL (OPTIONAL)
 * ================================
 */
window.addEventListener("NOTIFICATION_CLEAR_ALL", function () {
  const items = document.querySelectorAll("#notify-dropdown .notify-item");

  items.forEach((item) => {
    item.classList.remove("unread");
    item.classList.add("read");
  });

  unreadCount = 0;
  renderBadge();
});

/**
 * ================================
 * MARK ALL READ – HOTKEY
 * ================================
 */
document.addEventListener("keydown", async function (e) {
  if (e.ctrlKey && e.shiftKey && e.key === "M") {
    try {
      await fetch("/client/read-all", { method: "POST" });
    } catch (err) {
      console.error("❌ Mark all read error:", err);
    }
  }
});
