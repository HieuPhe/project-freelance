module.exports = (io, socket) => {
  // Join room theo project
  socket.on("join_progress", ({ projectId }) => {
    if (!projectId) return;

    const room = `project_progress_${projectId}`;
    socket.join(room);

    console.log("[SOCKET] join progress room:", room);
  });

  // Freelancer gửi tiến độ mới
  socket.on("send_progress", (data) => {
    const { projectId, progress } = data;
    if (!projectId || !progress) return;

    const room = `project_progress_${projectId}`;

    // Emit cho tất cả user trong project
    socket.to(room).emit("receive_progress", progress);
  });
};
