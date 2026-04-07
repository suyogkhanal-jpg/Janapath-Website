(function () {
  const NOTICE_KEY = "janapath_notice_content";
  const defaultNotices = [
    {
      id: "default-holiday-1",
      title: "Public Holiday Notice",
      message: "School will remain closed for 5 days due to public holiday. Classes resume on the next working day.",
      type: "Holiday",
      date: new Date().toISOString()
    }
  ];

  function readNotices() {
    try {
      const raw = localStorage.getItem(NOTICE_KEY);
      if (!raw) return defaultNotices;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) return defaultNotices;
      return parsed;
    } catch (err) {
      return defaultNotices;
    }
  }

  function renderNotices() {
    const list = document.getElementById("notices-list");
    if (!list) return;
    const notices = readNotices();
    list.innerHTML = notices
      .map(function (row) {
        const date = row.date ? new Date(row.date).toLocaleDateString() : "-";
        return (
          '<article class="notice-card">' +
          '<div class="notice-card-top">' +
          '<span class="notice-type">' + (row.type || "Notice") + "</span>" +
          '<span class="notice-date">' + date + "</span>" +
          "</div>" +
          '<h3 class="notice-title">' + (row.title || "Notice") + "</h3>" +
          '<p class="notice-message">' + (row.message || "") + "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderNotices);
  } else {
    renderNotices();
  }
})();
