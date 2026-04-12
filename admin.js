(function () {
  const AUTH_KEY = "janapath_admin_auth";
  const ADMIN_EMAIL = "admin@janapath.com";
  const ADMIN_PASSWORD = "admin1234";
  const SETTINGS_KEY = "janapath_admission_settings";
  const SUBMISSIONS_KEY = "janapath_admission_submissions";
  const CONTENT_KEY = "janapath_site_content";
  const HERO_KEY = "janapath_hero_content";
  const MENU_KEY = "janapath_menu_content";
  const NOTICE_KEY = "janapath_notice_content";
  const STATUS_KEY = "janapath_school_status";
  const defaultStatus = {
    forceClosed: false,
    closedFrom: "",
    closedTo: ""
  };
  const defaultSettings = {
    heading: "Admission Application",
    subtitle: "Fill in the details below and we will get back to you promptly.",
    instructions: [
      "Use student full name and correct date of birth.",
      "Select the grade you want to apply for.",
      "Provide parent/guardian and contact details.",
      "Add previous school and message if needed."
    ],
    requirements: [
      "Copy of birth certificate",
      "Previous school report card",
      "Passport-size photo",
      "Parent/guardian citizenship copy"
    ],
    grades: ["Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"]
  };
  const defaultNotices = [
    {
      id: "default-holiday-1",
      title: "Public Holiday Notice",
      message: "School will remain closed for 5 days due to public holiday. Classes resume on the next working day.",
      type: "Holiday",
      date: new Date().toISOString()
    }
  ];

  function showLogin() {
    const loginWrap = document.getElementById("login-wrap");
    const dashboardWrap = document.getElementById("dashboard-wrap");
    if (loginWrap) loginWrap.hidden = false;
    if (dashboardWrap) dashboardWrap.hidden = true;
  }

  function showPanel() {
    const loginWrap = document.getElementById("login-wrap");
    const dashboardWrap = document.getElementById("dashboard-wrap");
    if (loginWrap) loginWrap.hidden = true;
    if (dashboardWrap) dashboardWrap.hidden = false;
  }

  function linesToArray(value) {
    return value
      .split("\n")
      .map(function (line) {
        return line.trim();
      })
      .filter(Boolean);
  }

  function readSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return defaultSettings;
      const parsed = JSON.parse(raw);
      return {
        heading: parsed.heading || defaultSettings.heading,
        subtitle: parsed.subtitle || defaultSettings.subtitle,
        instructions: Array.isArray(parsed.instructions) && parsed.instructions.length
          ? parsed.instructions
          : defaultSettings.instructions,
        requirements: Array.isArray(parsed.requirements) && parsed.requirements.length
          ? parsed.requirements
          : defaultSettings.requirements,
        grades: Array.isArray(parsed.grades) && parsed.grades.length
          ? parsed.grades
          : defaultSettings.grades
      };
    } catch (err) {
      return defaultSettings;
    }
  }

  function readSubmissions() {
    try {
      const raw = localStorage.getItem(SUBMISSIONS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function readSiteContent() {
    try {
      const raw = localStorage.getItem(CONTENT_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveSiteContent(items) {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(items));
  }

  function readRows(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveRows(key, rows) {
    localStorage.setItem(key, JSON.stringify(rows));
  }

  function formatDate(value) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString();
  }

  function renderSubmissions() {
    const rows = readSubmissions();
    const body = document.getElementById("submissions-body");
    if (!body) return;

    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="6">No submissions yet.</td></tr>';
      return;
    }

    body.innerHTML = rows
      .map(function (row) {
        const student = [row.firstName, row.lastName].filter(Boolean).join(" ");
        return (
          "<tr>" +
          "<td>" + formatDate(row.createdAt) + "</td>" +
          "<td>" + (student || "-") + "</td>" +
          "<td>" + (row.grade || "-") + "</td>" +
          "<td>" + (row.contactNumber || "-") + "</td>" +
          "<td>" + (row.guardianName || "-") + "</td>" +
          "<td>" + (row.message || "-") + "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function fillSettingsForm() {
    const settings = readSettings();
    document.getElementById("setting-heading").value = settings.heading;
    document.getElementById("setting-subtitle").value = settings.subtitle;
    document.getElementById("setting-grades").value = settings.grades.join("\n");
    document.getElementById("setting-instructions").value = settings.instructions.join("\n");
    document.getElementById("setting-requirements").value = settings.requirements.join("\n");
  }

  function initPanelTools() {
    fillSettingsForm();
    renderSubmissions();
    renderContentRows();
    renderHeroRows();
    renderMenuRows();
    renderNoticeRows();
    fillStatusForm();
    setupViews();

    const settingsForm = document.getElementById("settings-form");
    if (settingsForm) {
      settingsForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(settingsForm);
        const nextSettings = {
          heading: String(formData.get("heading") || "").trim(),
          subtitle: String(formData.get("subtitle") || "").trim(),
          grades: linesToArray(String(formData.get("grades") || "")),
          instructions: linesToArray(String(formData.get("instructions") || "")),
          requirements: linesToArray(String(formData.get("requirements") || ""))
        };

        localStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
        const status = document.getElementById("settings-status");
        if (status) status.textContent = "Saved. Admission section updated.";
      });
    }

    const clearBtn = document.getElementById("clear-submissions-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        if (!window.confirm("Delete all admission submissions?")) return;
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([]));
        renderSubmissions();
      });
    }

    const contentForm = document.getElementById("content-form");
    if (contentForm) {
      contentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(contentForm);
        const row = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
          section: String(data.get("section") || "home"),
          topic: String(data.get("topic") || "").trim(),
          text: String(data.get("text") || "").trim(),
          createdAt: new Date().toISOString()
        };

        if (!row.topic || !row.text) return;
        const items = readSiteContent();
        items.unshift(row);
        saveSiteContent(items);
        contentForm.reset();
        const status = document.getElementById("content-status");
        if (status) status.textContent = "Topic added successfully.";
        renderContentRows();
      });
    }

    const contentBody = document.getElementById("content-body");
    if (contentBody) {
      contentBody.addEventListener("click", function (e) {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        if (!target.matches("button[data-delete-id]")) return;
        const id = target.getAttribute("data-delete-id");
        if (!id) return;
        const filtered = readSiteContent().filter(function (item) {
          return item.id !== id;
        });
        saveSiteContent(filtered);
        renderContentRows();
      });
    }

    const heroForm = document.getElementById("hero-form");
    if (heroForm) {
      heroForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(heroForm);
        const row = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
          headline: String(data.get("headline") || "").trim(),
          subheadline: String(data.get("subheadline") || "").trim(),
          images: String(data.get("images") || "0").trim(),
          stats: String(data.get("stats") || "0").trim(),
          status: "Active",
          updatedAt: new Date().toISOString()
        };
        if (!row.headline || !row.subheadline) return;
        const rows = readRows(HERO_KEY);
        rows.unshift(row);
        saveRows(HERO_KEY, rows);
        heroForm.reset();
        const status = document.getElementById("hero-status");
        if (status) status.textContent = "Hero content added.";
        renderHeroRows();
      });
    }

    const menuForm = document.getElementById("menu-form");
    if (menuForm) {
      menuForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(menuForm);
        const row = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
          label: String(data.get("label") || "").trim(),
          url: String(data.get("url") || "").trim()
        };
        if (!row.label || !row.url) return;
        const rows = readRows(MENU_KEY);
        rows.unshift(row);
        saveRows(MENU_KEY, rows);
        menuForm.reset();
        const status = document.getElementById("menu-status");
        if (status) status.textContent = "Menu item added.";
        renderMenuRows();
      });
    }

    const heroBody = document.getElementById("hero-body");
    if (heroBody) {
      heroBody.addEventListener("click", function (e) {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        if (!target.matches("button[data-hero-delete-id]")) return;
        const id = target.getAttribute("data-hero-delete-id");
        if (!id) return;
        const rows = readRows(HERO_KEY).filter(function (row) {
          return row.id !== id;
        });
        saveRows(HERO_KEY, rows);
        renderHeroRows();
      });
    }

    const menuBody = document.getElementById("menu-body");
    if (menuBody) {
      menuBody.addEventListener("click", function (e) {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        if (!target.matches("button[data-menu-delete-id]")) return;
        const id = target.getAttribute("data-menu-delete-id");
        if (!id) return;
        const rows = readRows(MENU_KEY).filter(function (row) {
          return row.id !== id;
        });
        saveRows(MENU_KEY, rows);
        renderMenuRows();
      });
    }

    const noticeForm = document.getElementById("notice-form");
    if (noticeForm) {
      noticeForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(noticeForm);
        const row = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
          title: String(data.get("title") || "").trim(),
          type: String(data.get("type") || "").trim(),
          date: String(data.get("date") || "").trim(),
          message: String(data.get("message") || "").trim()
        };
        if (!row.title || !row.message) return;
        const rows = readNoticeRows();
        rows.unshift(row);
        saveRows(NOTICE_KEY, rows);
        noticeForm.reset();
        const status = document.getElementById("notice-status");
        if (status) status.textContent = "Notice added.";
        renderNoticeRows();
      });
    }

    initStatusTools();

    const noticeBody = document.getElementById("notice-body");
    if (noticeBody) {
      noticeBody.addEventListener("click", function (e) {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        if (!target.matches("button[data-notice-delete-id]")) return;
        const id = target.getAttribute("data-notice-delete-id");
        if (!id) return;
        const rows = readNoticeRows().filter(function (row) {
          return row.id !== id;
        });
        saveRows(NOTICE_KEY, rows);
        renderNoticeRows();
      });
    }
  }

  function renderContentRows() {
    const body = document.getElementById("content-body");
    if (!body) return;
    const rows = readSiteContent();
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="4">No content rows yet.</td></tr>';
      return;
    }

    body.innerHTML = rows
      .map(function (row) {
        return (
          "<tr>" +
          "<td>" + (row.section || "-") + "</td>" +
          "<td>" + (row.topic || "-") + "</td>" +
          "<td>" + (row.text || "-") + "</td>" +
          '<td><button class="action-btn" type="button" data-delete-id="' + row.id + '">Delete</button></td>' +
          "</tr>"
        );
      })
      .join("");
  }

  function renderHeroRows() {
    const body = document.getElementById("hero-body");
    if (!body) return;
    const rows = readRows(HERO_KEY);
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="7">No hero rows yet.</td></tr>';
      return;
    }

    body.innerHTML = rows
      .map(function (row) {
        return (
          "<tr>" +
          "<td>" + (row.headline || "-") + "</td>" +
          "<td>" + (row.subheadline || "-") + "</td>" +
          "<td>" + (row.images || "0") + "</td>" +
          "<td>" + (row.stats || "0") + "</td>" +
          "<td>" + (row.status || "Active") + "</td>" +
          "<td>" + formatDate(row.updatedAt) + "</td>" +
          '<td><button class="action-btn" type="button" data-hero-delete-id="' + row.id + '">Delete</button></td>' +
          "</tr>"
        );
      })
      .join("");
  }

  function renderMenuRows() {
    const body = document.getElementById("menu-body");
    if (!body) return;
    const rows = readRows(MENU_KEY);
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="3">No menu rows yet.</td></tr>';
      return;
    }

    body.innerHTML = rows
      .map(function (row) {
        return (
          "<tr>" +
          "<td>" + (row.label || "-") + "</td>" +
          "<td>" + (row.url || "-") + "</td>" +
          '<td><button class="action-btn" type="button" data-menu-delete-id="' + row.id + '">Delete</button></td>' +
          "</tr>"
        );
      })
      .join("");
  }

  function readNoticeRows() {
    const rows = readRows(NOTICE_KEY);
    if (!rows.length) return defaultNotices.slice();
    return rows;
  }

  function renderNoticeRows() {
    const body = document.getElementById("notice-body");
    if (!body) return;
    const rows = readNoticeRows();
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="5">No notice rows yet.</td></tr>';
      return;
    }

    body.innerHTML = rows
      .map(function (row) {
        const date = row.date ? new Date(row.date).toLocaleDateString() : "-";
        return (
          "<tr>" +
          "<td>" + (row.title || "-") + "</td>" +
          "<td>" + (row.type || "-") + "</td>" +
          "<td>" + date + "</td>" +
          "<td>" + (row.message || "-") + "</td>" +
          '<td><button class="action-btn" type="button" data-notice-delete-id="' + row.id + '">Delete</button></td>' +
          "</tr>"
        );
      })
      .join("");
  }

  function readSchoolStatus() {
    try {
      const raw = localStorage.getItem(STATUS_KEY);
      if (!raw) return defaultStatus;
      const parsed = JSON.parse(raw);
      return {
        forceClosed: parsed.forceClosed === true,
        closedFrom: String(parsed.closedFrom || ""),
        closedTo: String(parsed.closedTo || "")
      };
    } catch (err) {
      return defaultStatus;
    }
  }

  function saveSchoolStatus(status) {
    localStorage.setItem(STATUS_KEY, JSON.stringify(status));
  }

  function fillStatusForm() {
    const status = readSchoolStatus();
    const radioOpen = document.querySelector('input[name="schoolStatus"][value="open"]');
    const radioClosed = document.querySelector('input[name="schoolStatus"][value="closed"]');
    if (radioOpen) radioOpen.checked = !status.forceClosed;
    if (radioClosed) radioClosed.checked = status.forceClosed;
    const fromInput = document.getElementById("closure-from");
    const toInput = document.getElementById("closure-to");
    if (fromInput) fromInput.value = status.closedFrom;
    if (toInput) toInput.value = status.closedTo;
  }

  function initStatusTools() {
    const statusForm = document.getElementById("status-form");
    if (!statusForm) return;

    statusForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = new FormData(statusForm);
      const nextStatus = {
        forceClosed: String(data.get("schoolStatus")) === "closed",
        closedFrom: String(data.get("closedFrom") || "").trim(),
        closedTo: String(data.get("closedTo") || "").trim()
      };
      saveSchoolStatus(nextStatus);
      const statusMessage = document.getElementById("status-message");
      if (statusMessage) statusMessage.textContent = "School status saved.";
    });
  }

  function setupViews() {
    const buttons = Array.from(document.querySelectorAll(".side-link"));
    const panels = Array.from(document.querySelectorAll(".view-panel"));
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const viewId = btn.getAttribute("data-view");
        buttons.forEach(function (b) {
          b.classList.toggle("active", b === btn);
        });
        panels.forEach(function (p) {
          p.classList.toggle("active", p.id === viewId);
        });
      });
    });
  }

  function init() {
    if (sessionStorage.getItem(AUTH_KEY)) {
      showPanel();
      initPanelTools();
    } else {
      showLogin();
    }

    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    if (emailInput) {
      emailInput.addEventListener("input", function () {
        const error = document.getElementById("login-error");
        if (error) error.hidden = true;
      });
    }
    if (passwordInput) {
      passwordInput.addEventListener("input", function () {
        const error = document.getElementById("login-error");
        if (error) error.hidden = true;
      });
    }

    document.getElementById("login-form").addEventListener("submit", function (e) {
      e.preventDefault();
      const email = String(document.getElementById("email-input").value || "").trim().toLowerCase();
      const password = String(document.getElementById("password-input").value || "");
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, String(Date.now()));
        showPanel();
        initPanelTools();
      } else {
        document.getElementById("login-error").hidden = false;
      }
    });

    document.getElementById("logout-btn").addEventListener("click", function () {
      sessionStorage.removeItem(AUTH_KEY);
      window.location.reload();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
