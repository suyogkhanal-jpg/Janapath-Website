(function () {
  const AUTH_KEY = "janapath_admin_auth";
  const TEMP_PW_KEY = "janapath_temp_pw";

  function randomPassword(length) {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    const out = [];
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    for (let i = 0; i < length; i++) {
      out.push(chars[arr[i] % chars.length]);
    }
    return out.join("");
  }

  function showLogin() {
    document.getElementById("login-section").hidden = false;
    document.getElementById("admin-panel").hidden = true;
  }

  function showPanel() {
    document.getElementById("login-section").hidden = true;
    document.getElementById("admin-panel").hidden = false;
  }

  function init() {
    if (sessionStorage.getItem(AUTH_KEY)) {
      showPanel();
      return;
    }

    const pw = randomPassword(10);
    sessionStorage.setItem(TEMP_PW_KEY, pw);
    document.getElementById("temp-password-display").textContent = pw;

    showLogin();

    document.getElementById("password-input").addEventListener("input", function () {
      document.getElementById("login-error").hidden = true;
    });

    document.getElementById("login-form").addEventListener("submit", function (e) {
      e.preventDefault();
      const input = document.getElementById("password-input").value.trim();
      const expected = sessionStorage.getItem(TEMP_PW_KEY);
      if (input && expected && input === expected) {
        sessionStorage.removeItem(TEMP_PW_KEY);
        sessionStorage.setItem(AUTH_KEY, String(Date.now()));
        showPanel();
      } else {
        document.getElementById("login-error").hidden = false;
      }
    });

    document.getElementById("logout-btn").addEventListener("click", function () {
      sessionStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem(TEMP_PW_KEY);
      window.location.reload();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
