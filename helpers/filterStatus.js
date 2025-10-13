module.exports = (query) => {
  // Bộ lọc
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Đang mở",
      status: "OPEN",
      class: "",
    },
    {
      name: "Đang thực hiện",
      status: "IN_PROGRESS",
      class: "",
    },
    {
      name: "Hoàn thành",
      status: "CLOSED",
      class: "",
    },
    {
      name: "Hủy",
      status: "CANCELLED",
      class: "",
    },
  ];

  if (query.status) {
    const index = filterStatus.findIndex(
      (item) => item.status == query.status
    );
    filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex((item) => item.status == "");
    filterStatus[index].class = "active";
  }


  return filterStatus;
};
