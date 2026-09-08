/* ==========================================
   Progress Animation
========================================== */

window.addEventListener("load", function() {

    const progress = document.getElementById("progressFill");

    progress.style.width = "0%";

    setTimeout(() => {

        progress.style.width = "65%";

    }, 400);

});


/* ==========================================
   Other Exam
========================================== */

const examSelect = document.getElementById("examSelect");

const otherExamBox = document.getElementById("otherExamBox");

examSelect.addEventListener("change", function() {

    if (this.value === "Other") {

        otherExamBox.style.display = "block";

    } else {

        otherExamBox.style.display = "none";

    }

});


/* ==========================================
   Feedback Form
========================================== */

const form = document.getElementById("feedbackForm");

const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", function(e) {

    e.preventDefault();

    submitBtn.innerHTML = "Submitting...";

    submitBtn.disabled = true;

    setTimeout(function() {

        alert("✅ Thank You!\n\nYour feedback has been received.");

        form.reset();

        otherExamBox.style.display = "none";

        submitBtn.innerHTML =
            '<i class="fa-solid fa-paper-plane"></i> Submit Feedback';

        submitBtn.disabled = false;

    }, 1500);

});