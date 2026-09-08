// ======================================================
// KRISHNAPREP QUIZ SYSTEM
// Daily / Weekly / Monthly Quiz
// ======================================================

// ======================================================
// GOOGLE APPS SCRIPT URL
// ======================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzy5dc0iAMMug8IhbSzZal08ILSbEro1UAtzk2SBtpco5dUpFsmq3K442vlQW8a3E8T/exec";


// ======================================================
// GLOBAL VARIABLES
// ======================================================

let quizData = null;
let currentQuestion = 0;
let userAnswers = [];

let studentName = "";
let studentEmail = "";
let studentMobile = "";

let quizSubmitted = false;


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", function () {
    loadQuiz();
});


// ======================================================
// GET QUIZ FILE PATH
// ======================================================

function getQuizFilePath() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const date = String(today.getDate()).padStart(2, "0");


    // --------------------------------------------------
    // DAILY
    // --------------------------------------------------

    if (QUIZ_TYPE === "daily") {

        return `../data/daily/${year}-${month}-${date}.json`;

    }


    // --------------------------------------------------
    // WEEKLY
    // --------------------------------------------------

    if (QUIZ_TYPE === "weekly") {

        const startDate = new Date(year, 0, 1);

        const days = Math.floor(
            (today - startDate) /
            (24 * 60 * 60 * 1000)
        );

        const week = Math.ceil(
            (days + startDate.getDay() + 1) / 7
        );

        return `../data/weekly/${year}-week-${week}.json`;

    }


    // --------------------------------------------------
    // MONTHLY
    // --------------------------------------------------

    if (QUIZ_TYPE === "monthly") {

        return `../data/monthly/${year}-${month}.json`;

    }

}


// ======================================================
// LOAD QUIZ
// ======================================================

async function loadQuiz() {

    try {

        const filePath = getQuizFilePath();


        console.log("Quiz Type:", QUIZ_TYPE);

        console.log("Quiz File:", filePath);


        const response = await fetch(filePath);


        if (!response.ok) {

            throw new Error(
                "Quiz file not found: " + filePath
            );

        }


        quizData = await response.json();


        console.log("Quiz Loaded:", quizData);


        // --------------------------------------------------
        // RESET QUIZ
        // --------------------------------------------------

        currentQuestion = 0;

        userAnswers =
            new Array(
                quizData.questions.length
            ).fill(null);


        // --------------------------------------------------
        // UPDATE PAGE INFORMATION
        // --------------------------------------------------

        updateQuizInfo();


        // --------------------------------------------------
        // SHOW STUDENT FORM
        // --------------------------------------------------

        showStudentForm();


    } catch (error) {

        console.error(
            "Quiz loading error:",
            error
        );


        const container =
            document.getElementById(
                "quizContainer"
            );


        if (container) {

            container.innerHTML = `

                <div class="quiz-error">

                    <h2>
                        Quiz Not Available
                    </h2>

                    <p>
                        Sorry, the quiz could not be loaded.
                    </p>

                    <p>
                        Please try again later.
                    </p>

                </div>

            `;

        }

    }

}


// ======================================================
// UPDATE QUIZ INFORMATION
// ======================================================

function updateQuizInfo() {

    if (!quizData) {
        return;
    }


    const titleElement =
        document.getElementById(
            "quizTitle"
        );


    const infoElement =
        document.getElementById(
            "quizInfo"
        );


    if (titleElement) {

        titleElement.innerText =
            quizData.title ||
            "KrishnaPrep Quiz";

    }


    if (infoElement) {

        const totalQuestions =
            quizData.questions
                ? quizData.questions.length
                : 0;


        infoElement.innerText =
            `${totalQuestions} Questions`;

    }

}


// ======================================================
// STUDENT FORM
// ======================================================

function showStudentForm() {

    const container =
        document.getElementById(
            "quizContainer"
        );


    if (!container) {

        console.error(
            "quizContainer not found."
        );

        return;

    }


    container.innerHTML = `

        <div class="student-form">

            <h2>
                Enter Your Details
            </h2>

            <p>
                Please enter your details before starting the quiz.
            </p>


            <div class="form-group">

                <label for="studentNameInput">

                    Student Name

                    <span>*</span>

                </label>

                <input
                    type="text"
                    id="studentNameInput"
                    placeholder="Enter your full name"
                    autocomplete="name"
                >

            </div>


            <div class="form-group">

                <label for="studentEmailInput">

                    Email

                    <span>*</span>

                </label>

                <input
                    type="email"
                    id="studentEmailInput"
                    placeholder="Enter your email"
                    autocomplete="email"
                >

            </div>


            <div class="form-group">

                <label for="studentMobileInput">

                    Mobile Number

                    <small>(Optional)</small>

                </label>

                <input
                    type="tel"
                    id="studentMobileInput"
                    placeholder="Enter 10 digit mobile number"
                    maxlength="10"
                    autocomplete="tel"
                >

            </div>


            <p
                id="studentFormError"
                class="form-error"
            ></p>


            <button
                type="button"
                onclick="startQuiz()"
                class="start-quiz-btn"
            >

                Start Quiz

            </button>

        </div>

    `;

}


// ======================================================
// START QUIZ
// ======================================================

function startQuiz() {

    const nameInput =
        document.getElementById(
            "studentNameInput"
        );


    const emailInput =
        document.getElementById(
            "studentEmailInput"
        );


    const mobileInput =
        document.getElementById(
            "studentMobileInput"
        );


    const errorElement =
        document.getElementById(
            "studentFormError"
        );


    // --------------------------------------------------
    // GET VALUES
    // --------------------------------------------------

    const name =
        nameInput
            ? nameInput.value.trim()
            : "";


    const email =
        emailInput
            ? emailInput.value.trim()
            : "";


    const mobile =
        mobileInput
            ? mobileInput.value.trim()
            : "";


    // --------------------------------------------------
    // CLEAR ERROR
    // --------------------------------------------------

    if (errorElement) {
        errorElement.innerText = "";
    }


    // --------------------------------------------------
    // NAME VALIDATION
    // --------------------------------------------------

    if (name === "") {

        errorElement.innerText =
            "Please enter your name.";

        nameInput.focus();

        return;

    }


    // --------------------------------------------------
    // EMAIL VALIDATION
    // --------------------------------------------------

    if (email === "") {

        errorElement.innerText =
            "Please enter your email.";

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


    // --------------------------------------------------
    // MOBILE VALIDATION
    // --------------------------------------------------

    if (
        mobile !== "" &&
        !/^[6-9][0-9]{9}$/.test(mobile)
    ) {

        errorElement.innerText =
            "Please enter a valid 10 digit mobile number.";

        mobileInput.focus();

        return;

    }


    // --------------------------------------------------
    // SAVE STUDENT DETAILS
    // --------------------------------------------------

    studentName = name;

    studentEmail = email;

    studentMobile = mobile;


    // --------------------------------------------------
    // RESET QUIZ
    // --------------------------------------------------

    currentQuestion = 0;

    userAnswers =
        new Array(
            quizData.questions.length
        ).fill(null);


    // --------------------------------------------------
    // SAVE BASIC DATA
    // --------------------------------------------------

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


    // --------------------------------------------------
    // SHOW FIRST QUESTION
    // --------------------------------------------------

    showQuestion();

}


// ======================================================
// SHOW QUESTION
// ======================================================

function showQuestion() {

    if (!quizData) {
        return;
    }


    const questions =
        quizData.questions;


    const totalQuestions =
        questions.length;


    if (
        currentQuestion < 0 ||
        currentQuestion >= totalQuestions
    ) {
        return;
    }


    const question =
        questions[currentQuestion];


    const container =
        document.getElementById(
            "quizContainer"
        );


    if (!container) {
        return;
    }


    // --------------------------------------------------
    // QUESTION TEXT
    // --------------------------------------------------

    const questionText =
        question.question ||
        question.title ||
        "";


    // --------------------------------------------------
    // OPTIONS
    // --------------------------------------------------

    let optionsHTML = "";


    question.options.forEach(
        function (option, index) {

            let optionText = "";


            if (
                typeof option === "object"
            ) {

                optionText =
                    option.text ||
                    option.label ||
                    option.value ||
                    "";

            } else {

                optionText =
                    option;

            }


            const selected =
                userAnswers[currentQuestion] === index
                    ? "selected"
                    : "";


            optionsHTML += `

                <label
                    class="option ${selected}"
                >

                    <input
                        type="radio"
                        name="quizOption"
                        value="${index}"
                        ${selected ? "checked" : ""}
                        onchange="selectAnswer(${index})"
                    >

                    <span class="option-letter">

                        ${String.fromCharCode(65 + index)}

                    </span>

                    <span class="option-text">

                        ${optionText}

                    </span>

                </label>

            `;

        }
    );


    // --------------------------------------------------
    // BUTTON
    // --------------------------------------------------

    let buttonHTML = "";


    if (
        currentQuestion ===
        totalQuestions - 1
    ) {

        buttonHTML = `

            <button
                type="button"
                onclick="submitQuiz()"
                class="next-btn"
                id="submitQuizBtn"
            >

                Submit Quiz

            </button>

        `;

    } else {

        buttonHTML = `

            <button
                type="button"
                onclick="nextQuestion()"
                class="next-btn"
            >

                Next

            </button>

        `;

    }


    // --------------------------------------------------
    // PROGRESS
    // --------------------------------------------------

    const progress =
        Math.round(
            (
                (currentQuestion + 1) /
                totalQuestions
            ) * 100
        );


    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    container.innerHTML = `

        <div class="quiz-question-box">

            <div class="question-header">

                <span>

                    Question ${currentQuestion + 1}
                    of ${totalQuestions}

                </span>

                <span>

                    ${progress}%

                </span>

            </div>


            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width:${progress}%"
                ></div>

            </div>


            <div class="question-text">

                ${questionText}

            </div>


            <div class="options-container">

                ${optionsHTML}

            </div>


            <p
                id="answerError"
                class="form-error"
            ></p>


            <div class="quiz-navigation">

                ${buttonHTML}

            </div>

        </div>

    `;

}


// ======================================================
// SELECT ANSWER
// ======================================================

function selectAnswer(index) {

    userAnswers[currentQuestion] =
        index;


    const options =
        document.querySelectorAll(
            ".option"
        );


    options.forEach(
        function (option, i) {

            if (i === index) {

                option.classList.add(
                    "selected"
                );

            } else {

                option.classList.remove(
                    "selected"
                );

            }

        }
    );

}


// ======================================================
// NEXT QUESTION
// ======================================================

function nextQuestion() {

    const answerError =
        document.getElementById(
            "answerError"
        );


    // --------------------------------------------------
    // ANSWER REQUIRED
    // --------------------------------------------------

    if (
        userAnswers[currentQuestion] === null ||
        userAnswers[currentQuestion] === undefined
    ) {

        if (answerError) {

            answerError.innerText =
                "Please select an answer before continuing.";

        }

        return;

    }


    // --------------------------------------------------
    // NEXT
    // --------------------------------------------------

    if (
        currentQuestion <
        quizData.questions.length - 1
    ) {

        currentQuestion++;

        showQuestion();

    }

}


// ======================================================
// SUBMIT QUIZ
// ======================================================

async function submitQuiz() {

    // --------------------------------------------------
    // PREVENT DOUBLE SUBMIT
    // --------------------------------------------------

    if (quizSubmitted) {
        return;
    }


    const answerError =
        document.getElementById(
            "answerError"
        );


    // --------------------------------------------------
    // LAST QUESTION ANSWER REQUIRED
    // --------------------------------------------------

    if (
        userAnswers[currentQuestion] === null ||
        userAnswers[currentQuestion] === undefined
    ) {

        if (answerError) {

            answerError.innerText =
                "Please select an answer before submitting.";

        }

        return;

    }


    // --------------------------------------------------
    // LOCK SUBMIT
    // --------------------------------------------------

    quizSubmitted = true;


    const submitButton =
        document.getElementById(
            "submitQuizBtn"
        );


    if (submitButton) {

        submitButton.disabled = true;

        submitButton.innerText =
            "Submitting...";

    }


    try {

        const questions =
            quizData.questions;


        const total =
            questions.length;


        let score = 0;

        let attempted = 0;


        // --------------------------------------------------
        // CHECK ANSWERS
        // --------------------------------------------------

        questions.forEach(
            function (question, index) {

                const userAnswer =
                    userAnswers[index];


                if (
                    userAnswer !== null &&
                    userAnswer !== undefined
                ) {

                    attempted++;

                }


                const correctAnswer =
                    question.answer;


                if (
                    Number(userAnswer) ===
                    Number(correctAnswer)
                ) {

                    score++;

                }

            }
        );


        // --------------------------------------------------
        // WRONG ANSWERS
        // --------------------------------------------------

        const wrong =
            attempted - score;


        // --------------------------------------------------
        // PERCENTAGE
        // --------------------------------------------------

        const percentage =
            total > 0
                ? Math.round(
                    (score / total) * 100
                )
                : 0;


        // --------------------------------------------------
        // PASS / FAIL
        // --------------------------------------------------

        const passPercentage = 40;


        const passed =
            percentage >= passPercentage;


        const resultStatus =
            passed
                ? "PASS"
                : "FAIL";


        // --------------------------------------------------
        // QUIZ ID
        // --------------------------------------------------

        const quizId =
            quizData.quizId ||
            quizData.id ||
            "";


        // --------------------------------------------------
        // DATA FOR GOOGLE SHEET
        // --------------------------------------------------

        const dataToSend = {

            action: "saveQuizResult",

            studentName: studentName,

            studentEmail: studentEmail,

            studentMobile: studentMobile,

            quizType: QUIZ_TYPE,

            quizId: quizId,

            score: score,

            total: total,

            percentage: percentage,

            correct: score,

            wrong: wrong,

            attempted: attempted,

            result: resultStatus

            // IMPORTANT
            //   passed: resultStatus === "PASS"

        };


        console.log(
            "Sending result to Google Apps Script..."
        );


        console.log(
            "Data:",
            dataToSend
        );


        // --------------------------------------------------
        // SEND TO GOOGLE APPS SCRIPT
        // --------------------------------------------------

        const response =
            await fetch(
                GOOGLE_SCRIPT_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify(
                            dataToSend
                        )
                }
            );


        console.log(
            "Google Script HTTP Status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Google Apps Script HTTP error: " +
                response.status
            );

        }


        // --------------------------------------------------
        // READ GOOGLE SCRIPT RESPONSE
        // --------------------------------------------------

        const rawResponse =
            await response.text();


        console.log(
            "Google Script Raw Response:",
            rawResponse
        );


        let googleResponse;


        try {

            googleResponse =
                JSON.parse(
                    rawResponse
                );

        } catch (jsonError) {

            console.error(
                "Google Script JSON Parse Error:",
                jsonError
            );

            throw new Error(
                "Invalid response received from Google Apps Script."
            );

        }


        console.log(
            "Google Script Response:",
            googleResponse
        );


        // --------------------------------------------------
        // CHECK SAVE STATUS
        // --------------------------------------------------

        if (
            googleResponse.status !== "success"
        ) {

            throw new Error(
                googleResponse.message ||
                "Google Apps Script could not save the result."
            );

        }


        // --------------------------------------------------
        // GET CERTIFICATE ID
        // --------------------------------------------------

        const certificateId =
            googleResponse.certificateId ||
            googleResponse.certificateID ||
            "";


        console.log(
            "Certificate ID:",
            certificateId
        );


        // --------------------------------------------------
        // FINAL RESULT OBJECT
        // --------------------------------------------------

        const result = {

            studentName:
                studentName,

            studentEmail:
                studentEmail,

            studentMobile:
                studentMobile,

            quizType:
                QUIZ_TYPE,

            quizId:
                quizId,

            score:
                score,

            total:
                total,

            percentage:
                percentage,

            correct:
                score,

            wrong:
                wrong,

            attempted:
                attempted,

            passed:
                passed,

            result:
                resultStatus,

            certificateId:
                certificateId,

            date:
                new Date().toISOString()

        };


        // --------------------------------------------------
        // SAVE RESULT IN SESSION STORAGE
        // --------------------------------------------------

        sessionStorage.setItem(
            "quizResult",
            JSON.stringify(result)
        );


        // --------------------------------------------------
        // SAVE ANSWERS
        // --------------------------------------------------

        sessionStorage.setItem(
            "userAnswers",
            JSON.stringify(userAnswers)
        );


        console.log(
            "FINAL QUIZ RESULT:",
            result
        );


        // --------------------------------------------------
        // REDIRECT TO RESULT PAGE
        // --------------------------------------------------

        window.location.href =
            "../result/result.html";


    } catch (error) {

        // --------------------------------------------------
        // ALLOW SUBMIT AGAIN IF ERROR
        // --------------------------------------------------

        quizSubmitted = false;


        if (submitButton) {

            submitButton.disabled = false;

            submitButton.innerText =
                "Submit Quiz";

        }


        console.error(
            "GOOGLE SHEET SAVE ERROR:",
            error
        );


        if (answerError) {

            answerError.innerText =
                "Result save nahi ho saka. Please try again.";

        }

        alert(
            "Result Google Sheet mein save nahi ho saka.\n\nPlease try again."
        );

    }

}


// ======================================================
// PREVENT ACCIDENTAL PAGE LEAVE
// ======================================================

window.addEventListener(
    "beforeunload",
    function (e) {

        if (
            quizData &&
            currentQuestion >= 0 &&
            !quizSubmitted
        ) {

            e.preventDefault();

            e.returnValue = "";

        }

    }
);