var socket = io();

console.log("✅ socket.js loaded");

if (window.CURRENT_USER_ID) {
  socket.emit("join-user-room", window.CURRENT_USER_ID);
  console.log("✅ Joined room:", window.CURRENT_USER_ID);
}

socket.on("connect", () => {
  console.log("Connect success!", socket.id);
});

socket.on("NOTIFICATION_NEW", (data) => {
  console.log("🔔 Notification received:", data);

  window.dispatchEvent(
    new CustomEvent("NEW_NOTIFICATION", { detail: data })
  );
});

/**
 * ⚠️ DEBUG ONLY
 */
window.__testNotification = function () {
  console.log("🧪 Emit test notification");
  socket.emit("CLIENT_TEST_NOTIFICATION", {
    userId: window.CURRENT_USER_ID,
  });
};

socket.on("NOTIFICATION_READ_ALL", () => {
  window.dispatchEvent(
    new CustomEvent("NOTIFICATION_CLEAR_ALL")
  );
});

