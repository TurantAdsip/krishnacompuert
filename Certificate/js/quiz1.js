// ==========================================
// GLOBAL VARIABLES
// ==========================================

let quizData = null;
let userAnswers = {};


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    if (typeof QUIZ_TYPE === "undefined") {

        console.error("QUIZ_TYPE is not defined.");

        return;
    }

    loadQuiz();

});


// ==========================================
// MAIN QUIZ LOADER
// ==========================================

async function loadQuiz() {

    try {

        const filePath = getQuizFilePath();

        console.log("Loading quiz:", filePath);

        const response = await fetch(filePath);

        if (!response.ok) {

            throw new Error(
                `Quiz file not found: ${filePath}`
            );

        }

        quizData = await response.json();

        displayQuiz();

    } catch (error) {

        console.error(error);

        const container =
            document.getElementById("quizContainer");

        if (container) {

            container.innerHTML = `
                <div style="
                    text-align:center;
                    padding:30px;
                ">
                    <h3>Quiz Not Available</h3>
                    <p>
                        This quiz is currently unavailable.
                    </p>
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


    // --------------------------------------
    // DAILY
    // --------------------------------------

    if (QUIZ_TYPE === "daily") {

        const date =
            `${year}-${month}-${day}`;

        return `../data/daily/${date}.json`;

    }


    // --------------------------------------
    // WEEKLY
    // --------------------------------------

    if (QUIZ_TYPE === "weekly") {

        const weekNumber =
            getWeekNumber(today);

        const week =
            String(weekNumber).padStart(2, "0");

        return `../data/weekly/${year}-week-${week}.json`;

    }


    // --------------------------------------
    // MONTHLY
    // --------------------------------------

    if (QUIZ_TYPE === "monthly") {

        return `../data/monthly/${year}-${month}.json`;

    }


    throw new Error(
        "Invalid QUIZ_TYPE"
    );

}


// ==========================================
// WEEK NUMBER
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
// DISPLAY QUIZ
// ==========================================

function displayQuiz() {

    const titleElement =
        document.getElementById("quizTitle");

    const infoElement =
        document.getElementById("quizInfo");

    const container =
        document.getElementById("quizContainer");


    if (!container) {

        console.error(
            "quizContainer not found."
        );

        return;
    }


    // --------------------------------------
    // TITLE
    // --------------------------------------

    if (titleElement) {

        titleElement.innerText =
            quizData.title || "Quiz";

    }


    // --------------------------------------
    // INFO
    // --------------------------------------

    if (infoElement) {

        let info = "";

        if (quizData.date) {

            info += quizData.date;

        }

        if (quizData.totalQuestions) {

            info +=
                ` | ${quizData.totalQuestions} Questions`;

        }

        if (quizData.timeLimit) {

            info +=
                ` | ${quizData.timeLimit} Minutes`;

        }

        infoElement.innerText = info;

    }


    // --------------------------------------
    // CLEAR OLD QUESTIONS
    // --------------------------------------

    container.innerHTML = "";


    // --------------------------------------
    // CREATE QUESTIONS
    // --------------------------------------

    quizData.questions.forEach(
        function (question, index) {

            const questionDiv =
                document.createElement("div");

            questionDiv.className =
                "question";


            let optionsHTML = "";


            question.options.forEach(
                function (option, optionIndex) {

                    optionsHTML += `

                        <label class="option">

                            <input
                                type="radio"
                                name="question-${index}"
                                value="${optionIndex}"
                            >

                            <span>
                                ${option}
                            </span>

                        </label>

                    `;

                }
            );


            questionDiv.innerHTML = `

                <h3>
                    Q${index + 1}.
                    ${question.question}
                </h3>

                ${optionsHTML}

            `;


            container.appendChild(
                questionDiv
            );

        }
    );

}


// ==========================================
// SUBMIT QUIZ
// ==========================================

function submitQuiz() {

    if (!quizData) {

        alert(
            "Quiz is not loaded."
        );

        return;
    }


    let score = 0;

    let attempted = 0;


    quizData.questions.forEach(
        function (question, index) {

            const selected =
                document.querySelector(
                    `input[name="question-${index}"]:checked`
                );


            if (selected) {

                attempted++;

                const selectedAnswer =
                    Number(selected.value);


                if (
                    selectedAnswer ===
                    question.answer
                ) {

                    score++;

                }

            }

        }
    );


    const total =
        quizData.questions.length;


    const percentage =
        total > 0
            ? ((score / total) * 100).toFixed(2)
            : 0;


    console.log("Quiz Type:", QUIZ_TYPE);

    console.log("Score:", score);

    console.log("Total:", total);

    console.log("Attempted:", attempted);

    console.log("Percentage:", percentage);


    // --------------------------------------
    // TEMPORARY RESULT
    // --------------------------------------

    alert(
        `Quiz Completed!\n\n` +
        `Type: ${QUIZ_TYPE.toUpperCase()}\n` +
        `Score: ${score}/${total}\n` +
        `Percentage: ${percentage}%`
    );

}