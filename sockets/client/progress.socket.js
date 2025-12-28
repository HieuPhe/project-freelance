module.exports = (res) => {
  const userId = res.locals.user._id.toString();

  _io.once("connection", (socket) => {
    socket.on("JOIN_PROJECT_PROGRESS", (projectId) => {
      socket.join(projectId);
      console.log("USER JOIN PROGRESS ROOM:", projectId, userId);
    });
  });
};
