/* =====================================================
   KRISHNAPREP CERTIFICATE JAVASCRIPT
===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT URL
   IMPORTANT:
   Same URL as quiz.js
===================================================== */

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzy5dc0iAMMug8IhbSzZal08ILSbEro1UAtzk2SBtpco5dUpFsmq3K442vlQW8a3E8T/exec";


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadCertificate();

});


/* =====================================================
   LOAD CERTIFICATE
===================================================== */

function loadCertificate() {

    /* =================================================
       GET CERTIFICATE ID FROM URL
    ================================================= */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const certificateID =
        params.get("id");


    console.log(
        "Certificate ID:",
        certificateID
    );


    /* =================================================
       CERTIFICATE ID CHECK
    ================================================= */

    if (!certificateID) {

        showCertificateError(
            "Certificate ID not found."
        );

        return;
    }


    /* =================================================
       GOOGLE APPS SCRIPT API URL
    ================================================= */

    const apiURL =
        GOOGLE_SCRIPT_URL +
        "?id=" +
        encodeURIComponent(
            certificateID
        );


    console.log(
        "Certificate API URL:",
        apiURL
    );


    /* =================================================
       FETCH CERTIFICATE DATA
    ================================================= */

    fetch(apiURL)

        .then(function (response) {

            console.log(
                "Certificate HTTP Status:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    "Server response error: " +
                    response.status
                );

            }


            return response.text();

        })


        /* =================================================
           READ GOOGLE RESPONSE
        ================================================= */

        .then(function (responseText) {

            console.log(
                "Certificate Raw Response:",
                responseText
            );


            let data;


            try {

                data =
                    JSON.parse(
                        responseText
                    );

            }
            catch (error) {

                throw new Error(
                    "Invalid response from Google Apps Script."
                );

            }


            console.log(
                "Certificate Data:",
                data
            );


            return data;

        })


        /* =================================================
           PROCESS CERTIFICATE DATA
        ================================================= */

        .then(function (data) {


            /* =============================================
               ERROR RESPONSE
            ============================================= */

            if (
                !data ||
                data.status === "error"
            ) {

                showCertificateError(
                    data && data.message
                        ? data.message
                        : "Certificate Not Found."
                );

                return;

            }


            /* =============================================
               CHECK CERTIFICATE ID
            ============================================= */

            if (
                !data.certificateID &&
                !data.certificateId
            ) {

                showCertificateError(
                    "Invalid certificate data."
                );

                return;

            }


            /* =============================================
               STUDENT NAME
            ============================================= */

            const studentName =
                data.name ||
                data.studentName ||
                "Student Name";


            document.getElementById(
                "studentName"
            ).innerText =
                studentName;


            /* =============================================
               CERTIFICATE ID
            ============================================= */

            const returnedCertificateID =
                data.certificateID ||
                data.certificateId ||
                certificateID;


            document.getElementById(
                "certificateID"
            ).innerText =
                returnedCertificateID;


            /* =============================================
               PERCENTAGE
            ============================================= */

            document.getElementById(
                "percentage"
            ).innerText =
                formatPercentage(
                    data.percentage
                );


            /* =============================================
               QUIZ NAME
            ============================================= */

            let quizName =
                data.quizType ||
                data.quizName ||
                "Quiz";


            /*
               Convert quiz type into a nicer display name
            */

            if (
                quizName.toLowerCase() === "daily"
            ) {

                quizName = "Daily Quiz";

            }
            else if (
                quizName.toLowerCase() === "weekly"
            ) {

                quizName = "Weekly Quiz";

            }
            else if (
                quizName.toLowerCase() === "monthly"
            ) {

                quizName = "Monthly Quiz";

            }


            document.getElementById(
                "quizName"
            ).innerText =
                quizName;


            /* =============================================
               ISSUE DATE
            ============================================= */

            const submitTime =
                data.submitTime ||
                data.timestamp ||
                data.date;


            if (submitTime) {

                const issueDate =
                    new Date(
                        submitTime
                    );


                if (
                    !isNaN(
                        issueDate.getTime()
                    )
                ) {

                    document.getElementById(
                        "issueDate"
                    ).innerText =
                        issueDate.toLocaleDateString(
                            "en-GB",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            }
                        );

                }

            }


            /* =============================================
               CERTIFICATE LOADED
            ============================================= */

            console.log(
                "Certificate loaded successfully."
            );

        })


        /* =================================================
           FETCH ERROR
        ================================================= */

        .catch(function (error) {

            console.error(
                "Certificate Error:",
                error
            );


            showCertificateError(
                "Unable to load certificate. Please try again."
            );

        });

}


/* =====================================================
   FORMAT PERCENTAGE
===================================================== */

function formatPercentage(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "0%";

    }


    let text =
        value
            .toString()
            .trim();


    if (
        !text.endsWith("%")
    ) {

        text += "%";

    }


    return text;

}


/* =====================================================
   CERTIFICATE ERROR
===================================================== */

function showCertificateError(message) {

    const certificate =
        document.querySelector(
            ".certificate"
        );


    if (!certificate) {

        return;

    }


    certificate.innerHTML = `

        <div class="certificate-error">

            <h2>
                Certificate Error
            </h2>

            <p>
                ${message}
            </p>

            <a href="../index.html">
                Back to Home
            </a>

        </div>

    `;

}


/* =====================================================
   PRINT CERTIFICATE
===================================================== */

function printCertificate() {

    window.print();

}


/* =====================================================
   DOWNLOAD / PRINT PDF
===================================================== */

function downloadCertificate() {

    const certificate =
        document.querySelector(
            ".certificate"
        );


    if (!certificate) {

        alert(
            "Certificate is not available."
        );

        return;

    }


    const certificateHTML =
        certificate.outerHTML;


    /* =================================================
       FIND CERTIFICATE CSS
    ================================================= */

    let cssLink =
        document.querySelector(
            "link[href*='cert.css']"
        );


    /*
       Fallback if CSS filename is different
    */

    if (!cssLink) {

        cssLink =
            document.querySelector(
                "link[href*='certificate.css']"
            );

    }


    if (!cssLink) {

        alert(
            "Certificate CSS not found."
        );

        return;

    }


    const cssURL =
        cssLink.href;


    /* =================================================
       OPEN PRINT WINDOW
    ================================================= */

    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups for this website."
        );

        return;

    }


    /* =================================================
       WRITE CERTIFICATE HTML
    ================================================= */

    printWindow.document.write(`

        <!DOCTYPE html>

        <html lang="en">

        <head>

            <meta charset="UTF-8">

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <title>
                KrishnaPrep Certificate
            </title>


            <link
                rel="stylesheet"
                href="${cssURL}"
            >

            <style>

                    @page {
                        size: A4 landscape;
                        margin: 0;
                    }


                    html,
                    body {
                        width: 297mm !important;
                        height: 210mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }


                    body {
                        overflow: hidden !important;
                    }


                    .certificate {
                        width: 297mm !important;
                        height: 210mm !important;

                        max-width: none !important;
                        min-height: 0 !important;

                        margin: 0 !important;
                        padding: 45px !important;

                        box-sizing: border-box !important;

                        border: 10px solid #d4af37 !important;

                        box-shadow: none !important;

                        overflow: hidden !important;

                        page-break-before: avoid !important;
                        page-break-after: avoid !important;
                        page-break-inside: avoid !important;

                        break-before: avoid !important;
                        break-after: avoid !important;
                        break-inside: avoid !important;
                    }


                    .certificate:before {
                        inset: 15px !important;
                    }


                    .buttons {
                        display: none !important;
                    }


                    .top-border,
                    .certificate h1,
                    .certificate h3,
                    .certify,
                    .certificate h2,
                    .text,
                    .details,
                    .signature {
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }

            </style>

        </head>


        <body>

            ${certificateHTML}

        </body>

        </html>

    `);


    printWindow.document.close();


    /* =================================================
       WAIT FOR CSS / IMAGE
    ================================================= */

  setTimeout(function () {

    const images = printWindow.document.images;

    let loaded = 0;

    if (images.length === 0) {

        printWindow.focus();
        printWindow.print();
        return;

    }


    function checkImages() {

        loaded++;

        if (loaded >= images.length) {

            printWindow.focus();
            printWindow.print();

        }

    }


    for (let i = 0; i < images.length; i++) {

        if (images[i].complete) {

            checkImages();

        } else {

            images[i].addEventListener(
                "load",
                checkImages
            );

            images[i].addEventListener(
                "error",
                checkImages
            );

        }

    }

}, 500);

}   
