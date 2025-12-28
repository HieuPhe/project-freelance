console.log("PROGRESS JS RUNNING");

if (typeof socket === "undefined") {
  console.error("SOCKET GLOBAL NOT FOUND");
}

const container = document.querySelector("[data-project-id]");
if (!container) {
  console.error("NO data-project-id");
}

const projectId = container.dataset.projectId;
console.log("JOIN ROOM:", projectId);

// JOIN ROOM – giống chat
socket.emit("JOIN_PROJECT_PROGRESS", projectId);

// NHẬN REALTIME
socket.on("SERVER_RETURN_PROGRESS", (data) => {
  console.log("RECEIVED PROGRESS:", data);

  const list = document.querySelector(".progress-list");
  if (!list) return;

  const div = document.createElement("div");
  div.className = "border rounded p-2 mb-2";

  div.innerHTML = `
    <b>${data.freelancerName}</b>
    <small class="text-muted ml-2">
      ${new Date(data.createdAt).toLocaleString("vi-VN")}
    </small>
    <p class="mt-2">${data.content}</p>
    <span class="badge badge-success">${data.percent}%</span>
  `;

  list.prepend(div);
});
