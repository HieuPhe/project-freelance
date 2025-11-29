// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}

// End Show Alert

// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
  let url = new URL(window.location.href);

  buttonPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");

      url.searchParams.set("page", page);

      window.location.href = url.href;
    });
  });
}

// End Pagination

// Mid-Banner
document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector("[mid-banner-track]");
  const prevBtn = document.querySelector(".mid-banner-prev");
  const nextBtn = document.querySelector(".mid-banner-next");

  if (!track || !prevBtn || !nextBtn) return;

  const getStep = () => {
    const item = track.querySelector(".mid-banner-item");
    if (!item) return 0;
    const itemWidth = item.getBoundingClientRect().width;
    const gap = 16; // đúng với CSS gap
    return (itemWidth + gap) * 3; // trượt theo cụm 3 ảnh
  };

  nextBtn.addEventListener("click", () => {
    track.scrollLeft += getStep();
  });

  prevBtn.addEventListener("click", () => {
    track.scrollLeft -= getStep();
  });
});
