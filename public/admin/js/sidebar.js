document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;

  const toggler = sidebar.querySelector(".sidebar-toggler");
  const dropdowns = sidebar.querySelectorAll(".dropdown-container");

  /* -------------------------------
   * DROPDOWN HANDLER (Accordion)
   * ------------------------------- */
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");

    if (!toggle || !menu) return;

    // Đảm bảo ban đầu cao bằng 0
    menu.style.height = "0px";

    toggle.addEventListener("click", e => {
      e.preventDefault();
      
      // Nếu sidebar đang bị thu nhỏ (collapsed), không chạy accordion
      if (sidebar.classList.contains("collapsed")) return;

      const isOpen = dropdown.classList.contains("open");

      // Đóng các dropdown khác
      dropdowns.forEach(d => {
        if (d !== dropdown) {
          d.classList.remove("open");
          const m = d.querySelector(".dropdown-menu");
          if (m) m.style.height = "0px";
        }
      });

      // Toggle cái hiện tại
      if (isOpen) {
        dropdown.classList.remove("open");
        menu.style.height = "0px";
      } else {
        dropdown.classList.add("open");
        menu.style.height = menu.scrollHeight + "px";
      }
    });
  });

  /* -------------------------------
   * SIDEBAR COLLAPSE
   * ------------------------------- */
  if (toggler) {
    toggler.addEventListener("click", e => {
      sidebar.classList.toggle("collapsed");

      // Reset tất cả dropdown khi thu nhỏ sidebar để tránh lỗi hiển thị
      dropdowns.forEach(d => {
        d.classList.remove("open");
        const m = d.querySelector(".dropdown-menu");
        if (m) m.style.height = "0px";
      });
    });
  }

  /* -------------------------------
   * CLICK OUTSIDE (Đóng menu con nếu click ra ngoài)
   * ------------------------------- */
  document.addEventListener("click", e => {
    if (!sidebar.contains(e.target)) {
      dropdowns.forEach(d => {
        d.classList.remove("open");
        const m = d.querySelector(".dropdown-menu");
        if (m) m.style.height = "0px";
      });
    }
  });
});