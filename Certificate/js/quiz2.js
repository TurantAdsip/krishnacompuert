// ==========================================
// GLOBAL VARIABLES
// ==========================================

let quizData = null;
let currentQuestion = 0;
let userAnswers = [];

let studentName = "";
let studentEmail = "";
let studentMobile = "";

// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    loadQuiz();

});


// document.addEventListener("DOMContentLoaded", function () {

//     if (typeof QUIZ_TYPE === "undefined") {
//         console.error("QUIZ_TYPE is not defined.");
//         return;
//     }

//     loadQuiz();

// });


// ==========================================
// LOAD QUIZ
// ==========================================

async function loadQuiz() {

    try {

        const filePath = getQuizFilePath();

        console.log("Loading quiz:", filePath);

        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Quiz file not found: ${filePath}`);
        }

        quizData = await response.json();

        userAnswers =
            new Array(quizData.questions.length).fill(null);

        currentQuestion = 0;

        showStudentForm();

        // userAnswers =
        //     new Array(quizData.questions.length).fill(null);

        // currentQuestion = 0;

        // displayQuiz();

    } catch (error) {

        console.error(error);

        const container =
            document.getElementById("quizContainer");

        if (container) {

            container.innerHTML = `
                <div style="text-align:center;padding:30px;">
                    <h3>Quiz Not Available</h3>
                    <p>This quiz is currently unavailable.</p>
                </div>
            `;

        }

    }

}


// ==========================================
// GET QUIZ FILE PATH
// ==========================================

function getQuizFilePath() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");


    // DAILY
    if (QUIZ_TYPE === "daily") {

        const date =
            `${year}-${month}-${day}`;

        return `../data/daily/${date}.json`;

    }


    // WEEKLY
    if (QUIZ_TYPE === "weekly") {

        const weekNumber =
            getWeekNumber(today);

        const week =
            String(weekNumber).padStart(2, "0");

        return `../data/weekly/${year}-week-${week}.json`;

    }


    // MONTHLY
    if (QUIZ_TYPE === "monthly") {

        return `../data/monthly/${year}-${month}.json`;

    }


    throw new Error("Invalid QUIZ_TYPE");

}


// ==========================================
// GET WEEK NUMBER
// ==========================================

function getWeekNumber(date) {

    const tempDate =
        new Date(
            Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            )
        );

    const dayNum =
        tempDate.getUTCDay() || 7;

    tempDate.setUTCDate(
        tempDate.getUTCDate() + 4 - dayNum
    );

    const yearStart =
        new Date(
            Date.UTC(
                tempDate.getUTCFullYear(),
                0,
                1
            )
        );

    return Math.ceil(
        (
            (
                (tempDate - yearStart)
                / 86400000
            ) + 1
        ) / 7
    );

}


// ==========================================
// DISPLAY ONE QUESTION
// ==========================================

function displayQuiz() {

    const titleElement =
        document.getElementById("quizTitle");

    const infoElement =
        document.getElementById("quizInfo");

    const container =
        document.getElementById("quizContainer");


    if (!container) {
        console.error("quizContainer not found.");
        return;
    }


    // QUIZ TITLE
    if (titleElement) {

        titleElement.innerText =
            quizData.title || "Quiz";

    }


    // QUIZ INFO
    if (infoElement) {

        infoElement.innerText =
            `${quizData.date || ""} | ` +
            `${quizData.questions.length} Questions`;

    }


    // CURRENT QUESTION
    const question =
        quizData.questions[currentQuestion];


    let optionsHTML = "";


    question.options.forEach(
        function (option, optionIndex) {

            const checked =
                userAnswers[currentQuestion] === optionIndex
                    ? "checked"
                    : "";

            optionsHTML += `

                <label class="option">

                    <input
                        type="radio"
                        name="currentQuestion"
                        value="${optionIndex}"
                        ${checked}
                    >

                    <span>
                        ${option}
                    </span>

                </label>

            `;

        }
    );


    container.innerHTML = `

        <div class="question">

            <div style="
                margin-bottom:15px;
                font-weight:bold;
            ">
                Question ${currentQuestion + 1}
                of ${quizData.questions.length}
            </div>

            <h3>
                ${question.question}
            </h3>

            <div>
                ${optionsHTML}
            </div>

        </div>

        <div style="
            display:flex;
            justify-content:space-between;
            margin-top:25px;
        ">

            ${currentQuestion > 0
            ? `
                    <button
                        type="button"
                        onclick="previousQuestion()"
                        style="
                            padding:12px 25px;
                            cursor:pointer;
                        "
                    >
                        Previous
                    </button>
                `
            : `
                    <div></div>
                `
        }

            ${currentQuestion <
            quizData.questions.length - 1
            ? `
                    <button
                        type="button"
                        onclick="nextQuestion()"
                        style="
                            padding:12px 30px;
                            cursor:pointer;
                        "
                    >
                        Next
                    </button>
                `
            : `
                    <button
                        type="button"
                        onclick="submitQuiz()"
                        style="
                            padding:12px 30px;
                            cursor:pointer;
                        "
                    >
                        Submit Quiz
                    </button>
                `
        }

        </div>

    `;

}


// ==========================================
// SAVE CURRENT ANSWER
// ==========================================

function saveCurrentAnswer() {

    const selected =
        document.querySelector(
            'input[name="currentQuestion"]:checked'
        );


    if (selected) {

        userAnswers[currentQuestion] =
            Number(selected.value);

        return true;

    }


    return false;

}


// ==========================================
// NEXT QUESTION
// ==========================================

function nextQuestion() {

    const answered =
        saveCurrentAnswer();


    if (!answered) {

        alert("Please select an answer first.");

        return;

    }


    if (
        currentQuestion <
        quizData.questions.length - 1
    ) {

        currentQuestion++;

        displayQuiz();

    }

}


// ==========================================
// PREVIOUS QUESTION
// ==========================================

function previousQuestion() {

    saveCurrentAnswer();


    if (currentQuestion > 0) {

        currentQuestion--;

        displayQuiz();

    }

}


// ==========================================
// SUBMIT QUIZ
// ==========================================
function submitQuiz() {

    saveCurrentAnswer();


    let score = 0;
    let attempted = 0;


    quizData.questions.forEach(
        function (question, index) {

            if (userAnswers[index] !== null) {

                attempted++;

            }


            if (
                userAnswers[index] ===
                question.answer
            ) {

                score++;

            }

        }
    );


    const total =
        quizData.questions.length;


    const wrong =
        attempted - score;


    const percentage =
        total > 0
            ? Number(
                ((score / total) * 100).toFixed(2)
            )
            : 0;


    /*
     * TEMPORARY PASS MARK
     *
     * बाद में Daily / Weekly / Monthly
     * के लिए अलग-अलग criteria रखेंगे.
     */

    const passed =
        percentage >= 40;


    const result = {

        studentName: studentName,
        studentEmail: studentEmail,
        studentMobile: studentMobile,
        // studentName: "Student",

        quizType: QUIZ_TYPE,

        quizId: quizData.quizId,

        score: score,

        total: total,

        percentage: percentage,

        correct: score,

        wrong: wrong,

        attempted: attempted,

        passed: passed,

        date: new Date().toISOString()

    };


    // SAVE RESULT TEMPORARILY

    sessionStorage.setItem(
        "quizResult",
        JSON.stringify(result)
    );


    // GO TO RESULT PAGE

    window.location.href =
        "../result/result.html";

}



// function submitQuiz() {

//     saveCurrentAnswer();


//     let score = 0;


//     quizData.questions.forEach(
//         function (question, index) {

//             if (
//                 userAnswers[index] ===
//                 question.answer
//             ) {

//                 score++;

//             }

//         }
//     );


//     const total =
//         quizData.questions.length;


//     const percentage =
//         total > 0
//             ? ((score / total) * 100).toFixed(2)
//             : 0;


//     console.log("Quiz Type:", QUIZ_TYPE);
//     console.log("Score:", score);
//     console.log("Total:", total);
//     console.log("Percentage:", percentage);


//     alert(
//         `Quiz Completed!\n\n` +
//         `Type: ${QUIZ_TYPE.toUpperCase()}\n` +
//         `Score: ${score}/${total}\n` +
//         `Percentage: ${percentage}%`
//     );

// }

function showStudentForm() {

    const container =
        document.getElementById("quizContainer");

    if (!container) {
        console.error("quizContainer not found.");
        return;
    }

    container.innerHTML = `

        <div style="
            max-width:500px;
            margin:20px auto;
            padding:30px;
            background:#ffffff;
            border-radius:15px;
            box-shadow:0 5px 20px rgba(0,0,0,0.08);
        ">

            <div style="
                text-align:center;
                margin-bottom:25px;
            ">

                <h2 style="
                    margin-bottom:8px;
                ">
                    ${quizData.title || "Quiz"}
                </h2>

                <p style="
                    color:#64748b;
                    margin:0;
                ">
                    Enter your details to start the quiz
                </p>

            </div>


            <!-- STUDENT NAME -->

            <label style="
                display:block;
                margin-bottom:8px;
                font-weight:bold;
            ">
                Student Name
            </label>

            <input
                type="text"
                id="studentNameInput"
                placeholder="Enter your full name"
                autocomplete="name"
                style="
                    width:100%;
                    padding:13px;
                    border:1px solid #cbd5e1;
                    border-radius:8px;
                    font-size:15px;
                    margin-bottom:20px;
                "
            >


            <!-- STUDENT EMAIL -->

            <label style="
                display:block;
                margin-bottom:8px;
                font-weight:bold;
            ">
                Email Address
            </label>

            <input
                type="email"
                id="studentEmailInput"
                placeholder="Enter your email"
                autocomplete="email"
                style="
                    width:100%;
                    padding:13px;
                    border:1px solid #cbd5e1;
                    border-radius:8px;
                    font-size:15px;
                    margin-bottom:8px;
                "
            >

            <div id="formError"
                 style="
                    color:#dc2626;
                    font-size:14px;
                    min-height:20px;
                    margin-bottom:15px;
                 ">
            </div>

<!-- MOBILE NUMBER -->

<label style="
    display:block;
    margin-bottom:8px;
    font-weight:bold;
">
    Mobile Number
    <span style="
        color:#64748b;
        font-size:12px;
        font-weight:normal;
    ">
        (Optional)
    </span>
</label>

<input
    type="tel"
    id="studentMobileInput"
    placeholder="Enter 10 digit mobile number"
    maxlength="10"
    inputmode="numeric"
    autocomplete="tel"
    style="
        width:100%;
        padding:13px;
        border:1px solid #cbd5e1;
        border-radius:8px;
        font-size:15px;
        margin-bottom:20px;
    "
>

// const mobileInput =
//     document.getElementById("studentMobileInput");

// const mobile =
//     mobileInput.value.trim();
//     if (
//     mobile !== "" &&
//     !/^[6-9][0-9]{9}$/.test(mobile)
// ) {

//     errorElement.innerText =
//         "Please enter a valid 10 digit mobile number.";

//     mobileInput.focus();

//     return;
// }
            <!-- START BUTTON -->

            <button
                type="button"
                onclick="startQuiz()"
                style="
                    width:100%;
                    padding:14px;
                    border:none;
                    border-radius:8px;
                    background:#2563eb;
                    color:white;
                    font-size:16px;
                    font-weight:bold;
                    cursor:pointer;
                "
            >
                Start Quiz
            </button>

        </div>

    `;
}

function startQuiz() {

    const nameInput =
        document.getElementById("studentNameInput");

    const emailInput =
        document.getElementById("studentEmailInput");

    const errorElement =
        document.getElementById("formError");


    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim();


    /* =========================
       NAME VALIDATION
    ========================= */

    if (name === "") {

        errorElement.innerText =
            "Please enter your name.";

        nameInput.focus();

        return;

    }


    if (name.length < 2) {

        errorElement.innerText =
            "Please enter a valid name.";

        nameInput.focus();

        return;

    }


    /* =========================
       EMAIL VALIDATION
    ========================= */

    if (email === "") {

        errorElement.innerText =
            "Please enter your email address.";

        emailInput.focus();

        return;

    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        errorElement.innerText =
            "Please enter a valid email address.";

        emailInput.focus();

        return;

    }


    /* =========================
       SAVE STUDENT DETAILS
    ========================= */

    studentName = name;

    studentEmail = email;

    studentMobile = mobile;


    /* =========================
       SAVE TEMPORARILY
    ========================= */

    sessionStorage.setItem(
        "studentName",
        studentName
    );

    sessionStorage.setItem(
        "studentEmail",
        studentEmail
    );

    sessionStorage.setItem(
        "studentMobile",
        studentMobile
    );

    /* =========================
       START QUIZ
    ========================= */

    currentQuestion = 0;

    userAnswers =
        new Array(quizData.questions.length)
            .fill(null);


    displayQuiz();

}