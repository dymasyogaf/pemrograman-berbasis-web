/*
  Berkas: auth.js
  Keterangan: Berkas JavaScript berisi logika autentikasi untuk aplikasi SITTA UT
  Fungsi: Proses login, validasi form, dan notifikasi error
  Fitur: Form validation, toast notification, modal handling, dan session management
  Digunakan untuk: Mengamankan akses ke sistem manajemen stok dan tracking
*/

// Data pengguna diambil dari dataBahanAjar.js
const dataPengguna = dataBahanAjar.dataPengguna;

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const validationToast = document.getElementById("validationToast");
  const toastClose = document.getElementById("toastClose");
  const loginErrorNotification = document.getElementById(
    "loginErrorNotification",
  );
  const errorClose = document.getElementById("errorClose");
  const btnTryAgain = document.getElementById("btnTryAgain");
  const linkForgotPassword = document.getElementById("linkForgotPassword");

  if (!form) return;

  // ==============================
  // FORM VALIDATION
  // ==============================
  function validateLoginForm() {
    const formGroups = form.querySelectorAll(".form-group");
    let isValid = true;
    let firstErrorField = null;

    // Reset all error states
    formGroups.forEach((group) => {
      const input = group.querySelector(".input-control");
      const errorMessage = group.querySelector(".error-message");

      if (input) input.classList.remove("error");
      if (errorMessage) errorMessage.classList.remove("show");
    });

    // Validate each field
    formGroups.forEach((group) => {
      const input = group.querySelector(".input-control");
      const errorMessage = group.querySelector(".error-message");

      if (!input) return;

      // Check if field is empty
      if (!input.value.trim()) {
        input.classList.add("error");
        if (errorMessage) errorMessage.classList.add("show");
        isValid = false;

        // Store first error field for focus
        if (!firstErrorField) {
          firstErrorField = input;
        }
      }

      // Email validation
      if (input.type === "email" && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          input.classList.add("error");
          if (errorMessage) {
            errorMessage.textContent = "Format email tidak valid";
            errorMessage.classList.add("show");
          }
          isValid = false;

          if (!firstErrorField) {
            firstErrorField = input;
          }
        }
      }
    });

    // If validation fails, show toast and focus first error
    if (!isValid) {
      showToast();
      if (firstErrorField) {
        firstErrorField.focus();
      }
    }

    return isValid;
  }

  function showToast() {
    if (validationToast) {
      validationToast.classList.add("show");

      // Auto-hide after 5 seconds
      setTimeout(() => {
        hideToast();
      }, 5000);
    }
  }

  function hideToast() {
    if (validationToast) {
      validationToast.classList.remove("show");
    }
  }

  // REAL-TIME VALIDATION - Clear errors on input
  const formInputs = form.querySelectorAll(".input-control");
  formInputs.forEach((input) => {
    input.addEventListener("input", function () {
      const formGroup = this.closest(".form-group");
      const errorMessage = formGroup
        ? formGroup.querySelector(".error-message")
        : null;

      if (this.value.trim()) {
        this.classList.remove("error");
        if (errorMessage) {
          errorMessage.classList.remove("show");
          // Reset error message to default
          if (this.type === "email") {
            errorMessage.textContent = "Email wajib diisi";
          } else {
            errorMessage.textContent = "Password wajib diisi";
          }
        }
      }
    });
  });

  // TOAST CLOSE EVENT
  if (toastClose) {
    toastClose.onclick = () => {
      hideToast();
    };
  }

  // LOGIN ERROR NOTIFICATION FUNCTIONS
  function showLoginError() {
    if (loginErrorNotification) {
      loginErrorNotification.classList.add("show");
      // Focus on try again button for better accessibility
      setTimeout(() => {
        if (btnTryAgain) btnTryAgain.focus();
      }, 300);
    }
  }

  function hideLoginError() {
    if (loginErrorNotification) {
      loginErrorNotification.classList.remove("show");
      // Focus back to password field for better UX
      const passwordField = document.getElementById("password");
      if (passwordField) passwordField.focus();
    }
  }

  // ERROR NOTIFICATION EVENT LISTENERS
  if (errorClose) {
    errorClose.addEventListener("click", hideLoginError);
  }

  if (btnTryAgain) {
    btnTryAgain.addEventListener("click", hideLoginError);
  }

  if (linkForgotPassword) {
    linkForgotPassword.addEventListener("click", function (e) {
      e.preventDefault();
      hideLoginError();
      // Open forgot password modal
      const modalForgot = document.getElementById("modalForgot");
      if (modalForgot) {
        modalForgot.classList.add("show");
      }
    });
  }

  // Close notification when clicking outside content
  if (loginErrorNotification) {
    loginErrorNotification.addEventListener("click", function (e) {
      if (e.target === loginErrorNotification) {
        hideLoginError();
      }
    });
  }

  // Close notification with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (
        loginErrorNotification &&
        loginErrorNotification.classList.contains("show")
      ) {
        hideLoginError();
      }
      // Also close any open modals
      document.querySelectorAll(".modal.show").forEach((modal) => {
        modal.classList.remove("show");
      });
    }
  });

  // FORM SUBMISSION
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate form first
    if (!validateLoginForm()) {
      return;
    }

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Memproses...";
    submitBtn.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
      // Check against user data
      const user = dataPengguna.find(
        (u) => u.email === email && u.password === password,
      );

      if (user) {
        // Store user session
        sessionStorage.setItem("loggedUser", JSON.stringify(user));
        sessionStorage.setItem("justLoggedIn", "true");
        sessionStorage.setItem("welcomeName", user.nama || user.email || "Pengguna");

        // Show success feedback
        submitBtn.textContent = "\u2713 Berhasil";
        submitBtn.style.background = "var(--success-color)";

        // Redirect to dashboard after short delay
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      } else {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Show error notification
        showLoginError();
      }
    }, 800);
  });

  // ==============================
  // MODAL HANDLING
  // ==============================

  // Modal triggers
  const btnForgot = document.getElementById("btnForgot");
  const btnRegister = document.getElementById("btnRegister");
  const modalForgot = document.getElementById("modalForgot");
  const modalRegister = document.getElementById("modalRegister");

  if (btnForgot) {
    btnForgot.addEventListener("click", function () {
      if (modalForgot) modalForgot.classList.add("show");
    });
  }

  if (btnRegister) {
    btnRegister.addEventListener("click", function () {
      if (modalRegister) modalRegister.classList.add("show");
    });
  }

  // Modal close handlers
  document.querySelectorAll(".close[data-close]").forEach((closeBtn) => {
    closeBtn.addEventListener("click", function () {
      const modalId = this.getAttribute("data-close");
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove("show");
    });
  });

  // Close modal when clicking outside
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });
  });

  // ==============================
  // UTILITY FUNCTIONS
  // ==============================

  // Show reset message
  window.showResetMessage = function () {
    const email = document.getElementById("forgotEmail").value.trim();
    if (email) {
      alert(`Link reset password telah dikirim ke ${email}`);
      if (modalForgot) modalForgot.classList.remove("show");
    } else {
      alert("Silakan masukkan email terlebih dahulu");
    }
  };

  // Show register message
  window.showRegisterMessage = function () {
    alert("Registrasi berhasil! Silakan login dengan akun yang telah dibuat.");
    if (modalRegister) modalRegister.classList.remove("show");
  };

  // Check if user is already logged in
  const loggedUser = sessionStorage.getItem("loggedUser");
  if (loggedUser) {
    // User is already logged in, redirect to dashboard
    window.location.href = "index.html";
  }
});
