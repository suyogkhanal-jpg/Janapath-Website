(function () {
  const SETTINGS_KEY = "janapath_admission_settings";
  const SUBMISSIONS_KEY = "janapath_admission_submissions";
  const NOTICE_KEY = "janapath_notice_content";

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

  const STATUS_KEY = "janapath_school_status";
  const defaultSchoolStatus = {
    forceClosed: false,
    closedFrom: "",
    closedTo: ""
  };

  function readSchoolStatus() {
    try {
      const raw = localStorage.getItem(STATUS_KEY);
      if (!raw) return defaultSchoolStatus;
      const parsed = JSON.parse(raw);
      return {
        forceClosed: parsed.forceClosed === true,
        closedFrom: String(parsed.closedFrom || ""),
        closedTo: String(parsed.closedTo || "")
      };
    } catch (err) {
      return defaultSchoolStatus;
    }
  }

  function parseDate(value) {
    if (!value) return null;
    const parsed = new Date(value + "T00:00:00");
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function formatClosureLabel(from, to) {
    if (!from || !to) return "Closed until further notice";
    const start = new Date(from).toLocaleDateString();
    const end = new Date(to).toLocaleDateString();
    if (start === "Invalid Date" || end === "Invalid Date") return "Closed until further notice";
    return "Closed " + start + " to " + end;
  }

  function isWithinClosureRange(now, fromValue, toValue) {
    const from = parseDate(fromValue);
    const to = parseDate(toValue);
    if (!from || !to) return false;
    return now >= from && now <= new Date(to.getTime() + 24 * 60 * 60 * 1000 - 1);
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

  function setList(id, values, ordered) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = "";
    values.forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      el.appendChild(li);
    });
    if (ordered) el.setAttribute("start", "1");
  }

  function applySettingsToPage(settings) {
    const heading = document.getElementById("admission-heading");
    const subtitle = document.getElementById("admission-subtitle");
    const gradeSelect = document.getElementById("grade-select");
    if (heading) heading.textContent = settings.heading;
    if (subtitle) subtitle.textContent = settings.subtitle;
    setList("admission-instructions", settings.instructions, true);
    setList("admission-requirements", settings.requirements, false);

    if (gradeSelect) {
      gradeSelect.innerHTML = '<option value="">Select grade</option>';
      settings.grades.forEach(function (grade) {
        const option = document.createElement("option");
        option.value = grade;
        option.textContent = grade;
        gradeSelect.appendChild(option);
      });
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

  function saveSubmission(data) {
    const rows = readSubmissions();
    rows.unshift(data);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(rows));
  }

  function initForm() {
    const form = document.getElementById("admission-form");
    const success = document.getElementById("admission-success");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      data.createdAt = new Date().toISOString();
      saveSubmission(data);
      form.reset();
      if (success) {
        success.hidden = false;
        success.textContent = "Application submitted successfully. We will contact you soon.";
      }
    });
  }

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

  function renderNoticePreview() {
    const list = document.getElementById("notice-preview-list");
    if (!list) return;
    const notices = readNotices().slice(0, 3);
    list.innerHTML = notices
      .map(function (row) {
        const date = row.date ? new Date(row.date).toLocaleDateString() : "-";
        return (
          '<article class="notice-item">' +
          "<div>" +
          '<p class="notice-item-title">' + (row.title || "Notice") + "</p>" +
          '<p class="notice-item-desc">' + (row.message || "") + "</p>" +
          "</div>" +
          '<span class="notice-badge">' + (row.type || "Notice") + " • " + date + "</span>" +
          "</article>"
        );
      })
      .join("");
  }

  function init() {
    applySettingsToPage(readSettings());
    initForm();
    renderNoticePreview();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
