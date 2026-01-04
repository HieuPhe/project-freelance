const Notification = require("../../models/notification.model");

// [GET] /notifications
module.exports.index = async (req, res) => {
  const user = res.locals.user;

  if (!user) return res.json([]);

  const notifications = await Notification.find({
    userId: user._id,
    deleted: false,
  }).sort({ createdAt: -1 });

  res.json(notifications);
};


// [POST] /client/notifications/:id/read
module.exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;

    const notification = await Notification.findOne({
      _id: notificationId,
      userId: userId,
      deleted: false,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    // 🔔 sync badge realtime
    if (global._io) {
      global._io.to(`user_${userId}`).emit("NOTIFICATION_READ", {
        notificationId,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.log("markAsRead error:", err);
    res.status(500).json({ success: false });
  }
};

// [POST] /client/notifications/read-all
module.exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      {
        userId: userId,
        isRead: false,
        deleted: false,
      },
      {
        isRead: true,
      }
    );

    // sync realtime
    if (global._io) {
      global._io.to(`user_${userId}`).emit("NOTIFICATION_CLEAR_ALL");
    }

    res.json({ success: true });
  } catch (err) {
    console.log("markAllAsRead error:", err);
    res.status(500).json({ success: false });
  }
};


