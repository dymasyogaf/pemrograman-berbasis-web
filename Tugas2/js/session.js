// Utilitas manajemen sesi pengguna SITTA UT
// Session Management Functions
const SessionManager = {
  // Get current logged in user
  getCurrentUser() {
    const userStr = sessionStorage.getItem("loggedUser");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is logged in
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  // Logout user
  logout() {
    sessionStorage.removeItem("loggedUser");
    window.location.href = "login.html";
  },

  // Get user initial for avatar
  getUserInitial(user) {
    if (!user || !user.nama) return "?";
    return user.nama.charAt(0).toUpperCase();
  },

  // Check user role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  // Check if user can access specific UPBJJ
  canAccessUPBJJ(upbjj) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Admin can access all UPBJJ
    if (user.role === "admin") return true;

    // Operators can only access their own UPBJJ
    return user.upbjj === upbjj;
  },
};

// Initialize session on page load
document.addEventListener("DOMContentLoaded", function () {
  const currentUser = SessionManager.getCurrentUser();

  // If no user is logged in and not on login page, redirect to login
  if (!currentUser && !window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
    return;
  }

  // If user is logged in and on login page, redirect to dashboard
  if (currentUser && window.location.pathname.includes("login.html")) {
    window.location.href = "index.html";
    return;
  }

  // Update UI with user info if logged in
  if (currentUser) {
    updateUserInfo(currentUser);
    setupLogoutHandler();
    setupAccessControl(currentUser);
  }
});

// Update user info in the UI
function updateUserInfo(user) {
  const userInfoContainer = document.querySelector(".user-info");
  if (!userInfoContainer) return;

  const userInitial = SessionManager.getUserInitial(user);

  userInfoContainer.innerHTML = `
        <div class="user-avatar">${userInitial}</div>
        <div class="user-details">
            <div class="user-name">${user.nama}</div>
            <div class="user-role">${user.role === "admin" ? "Administrator" : `Operator ${user.upbjj}`}</div>
        </div>
    `;
}

// Setup logout handler
function setupLogoutHandler() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showLogoutConfirmation();
    });
  }
}

// Show logout confirmation
function showLogoutConfirmation() {
  const modal = document.getElementById("logoutModal");
  if (!modal) {
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari sistem?");
    if (confirmLogout) SessionManager.logout();
    return;
  }

  modal.classList.add("show");

  const cancelBtn = modal.querySelector("[data-action='logout-cancel']");
  const confirmBtn = modal.querySelector("[data-action='logout-confirm']");
  const closeModal = () => modal.classList.remove("show");

  if (cancelBtn) {
    cancelBtn.onclick = closeModal;
  }
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      SessionManager.logout();
    };
  }

  modal.addEventListener(
    "click",
    (e) => {
      if (e.target === modal) closeModal();
    },
    { once: true },
  );
}

// Setup access control based on user role
function setupAccessControl(user) {
  // Hide/show elements based on user role
  const adminOnlyElements = document.querySelectorAll(".admin-only");
  const operatorOnlyElements = document.querySelectorAll(".operator-only");

  if (user.role === "admin") {
    // Show admin-only elements
    adminOnlyElements.forEach((el) => (el.style.display = ""));
    // Hide operator-only elements
    operatorOnlyElements.forEach((el) => (el.style.display = "none"));
  } else {
    // Hide admin-only elements
    adminOnlyElements.forEach((el) => (el.style.display = "none"));
    // Show operator-only elements
    operatorOnlyElements.forEach((el) => (el.style.display = ""));

    // Filter data based on user's UPBJJ if applicable
    filterDataByUPBJJ(user.upbjj);
  }
}

// Filter data based on user's UPBJJ (for operators)
function filterDataByUPBJJ(userUPBJJ) {
  // This function can be called by specific pages to filter their data
  // Implementation depends on the specific page requirements

  // Example for stock page
  if (typeof filterStockByUPBJJ === "function") {
    filterStockByUPBJJ(userUPBJJ);
  }

  // Example for tracking page
  if (typeof filterTrackingByUPBJJ === "function") {
    filterTrackingByUPBJJ(userUPBJJ);
  }
}

// Utility function to format user display name
function formatUserDisplayName(user) {
  if (!user) return "";
  return user.nama || user.email || "Unknown User";
}

// Utility function to get user role display name
function getUserRoleDisplay(role) {
  switch (role) {
    case "admin":
      return "Administrator";
    case "operator":
      return "Operator";
    default:
      return "User";
  }
}

// Export SessionManager for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = SessionManager;
} else {
  window.SessionManager = SessionManager;
}
