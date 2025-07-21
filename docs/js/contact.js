// Highlight About in navbar
document.getElementById("nav-contact").classList.add("active");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const message = document.getElementById("message");

  function getError(field) {
    return field.parentNode.querySelector(".error-message");
  }

  function clearErrors() {
    [name, email, phone, message].forEach((f) => {
      const err = getError(f);
      err.textContent = "";
      err.style.visibility = "hidden";
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    let valid = true;

    //Name Validation
    if (name.value.trim().length < 2) {
      const err = getError(name);
      err.textContent = "Enter at least 2 characters.";
      err.style.visibility = "visible";
      valid = false;
    }

    // Email Validation
    if (!email.value.trim()) {
      const err = getError(email);
      err.textContent = "Email is required.";
      err.style.visibility = "visible";
      valid = false;
    } else if (!email.checkValidity()) {
      const err = getError(email);
      err.textContent = "Enter a valid email.";
      err.style.visibility = "visible";
      valid = false;
    }

    // Phone Validation
    const phoneVal = phone.value.trim();
    if (phoneVal) {
      if (!/^\d{10}$/.test(phoneVal)) {
        const err = getError(phone);
        err.textContent = "Enter 10 digits only.";
        err.style.visibility = "visible";
        valid = false;
      }
    }

    // Message Validation
    if (message.value.trim().length < 10) {
      const err = getError(message);
      err.textContent = "Enter at least 10 characters.";
      err.style.visibility = "visible";
      valid = false;
    }

    if (!valid) return;

    alert("Message sent!");
    form.reset();
  });

  [name, email, phone, message].forEach((f) => {
    f.addEventListener("input", () => {
      const err = getError(f);
      err.textContent = "";
      err.style.visibility = "hidden";
    });
  });
});
