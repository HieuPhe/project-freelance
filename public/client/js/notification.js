console.log("✅ notification.js loaded");

/**
 * ================================
 * SOCKET → FRONTEND EVENT
 * ================================
 */
window.addEventListener("NEW_NOTIFICATION", function (e) {
  const data = e.detail;

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
    <div class="notify-title">${data.title}</div>
    <div class="notify-content">${data.message || data.content}</div>
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
  const dropdown = document.getElementById("notify-dropdown");
  if (!dropdown) return;

  // tránh render trùng notification
  if (data._id) {
    const exists = dropdown.querySelector(
      `.notify-item[data-id="${data._id}"]`
    );
    if (exists) return;
  }

  const empty = dropdown.querySelector(".notify-empty");
  if (empty) empty.remove();

  const item = document.createElement("a");

  // 🔴 QUAN TRỌNG: class + dataset để mark read
  item.className = `dropdown-item notify-item ${
    data.isRead ? "read" : "unread"
  }`;
  item.dataset.id = data._id;

  item.href = data.projectId
    ? `/hirer/projects/${data.projectId}/proposals`
    : "javascript:void(0)";

  item.innerHTML = `
    <strong>${data.title}</strong>
    <div style="font-size:13px">${data.message || data.content}</div>
    <small class="text-muted">${new Date().toLocaleString()}</small>
  `;

  dropdown.prepend(item);
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
    const res = await fetch("/notifications");
    const list = await res.json();

    if (!Array.isArray(list)) return;

    list.forEach((n) => {
      addNotificationToDropdown({
        _id: n._id,
        title: n.title,
        content: n.content,
        projectId: n.projectId,
        isRead: n.isRead,
      });

      if (!n.isRead) unreadCount++;
    });

    renderBadge();
  } catch (err) {
    console.log("Load notification error:", err);
  }
});

/**
 * ================================
 * CLICK → MARK AS READ (BƯỚC 5)
 * ================================
 */
document.addEventListener("click", async function (e) {
  const notifyItem = e.target.closest(".notify-item");
  if (!notifyItem) return;

  const notifyId = notifyItem.dataset.id;
  if (!notifyId) return;

  // đã đọc thì bỏ qua
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
    console.error("Read notification error:", error);
    delete notifyItem.dataset.loading;
  }
});

/**
 * ================================
 * REALTIME SYNC READ (BƯỚC 6)
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

window.addEventListener("NOTIFICATION_CLEAR_ALL", function () {
  const items = document.querySelectorAll("#notify-dropdown .notify-item");
  items.forEach((item) => {
    item.classList.remove("unread");
    item.classList.add("read");
  });

  const badge = document.getElementById("notify-badge");
  if (badge) {
    badge.innerText = "0";
    badge.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("notify-wrapper");
  if (!wrapper) return;

  wrapper.addEventListener("click", function () {
    renderBadge(); // chỉ refresh UI, không đổi state DB
  });
});

document.addEventListener("keydown", async function (e) {
  // Ctrl + Shift + M → mark all read (admin / power user)
  if (e.ctrlKey && e.shiftKey && e.key === "M") {
    try {
      await fetch("/client/notifications/read-all", {
        method: "POST",
      });
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  }
});
