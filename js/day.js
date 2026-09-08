/**********************************************************************
 * EXAM PORTAL
 * DAILY CURRENT AFFAIRS
 * day.js
 **********************************************************************/

"use strict";

/**********************************************************************
 * Configuration
 **********************************************************************/

const DATA_FOLDER = "../data";
// fetch("../data/july-2026.json")

/**********************************************************************
 * Get URL Parameters
 **********************************************************************/

function getUrlParameter(name) {

    const params = new URLSearchParams(window.location.search);

    return params.get(name);

}

/**********************************************************************
 * Format Month File Name
 *
 * Example
 * 2026-07-14
 *
 * ↓
 *
 * july-2026.json
 **********************************************************************/

function getMonthFile(dateString) {

    const date = new Date(dateString);

    const month = date.toLocaleString("en-US", {

            month: "long"

        })
        // .toLowerCase();

    const year = date.getFullYear();

    return `${month}-${year}.json`;

}

/**********************************************************************
 * Load JSON File
 **********************************************************************/

async function loadCurrentAffairs() {

    try {

        const date = getUrlParameter("id");

        if (!date) {

            throw new Error("Date Not Found");

        }

        const fileName = getMonthFile(date);

        const response = await fetch(`${DATA_FOLDER}/${fileName}`);

        if (!response.ok) {

            throw new Error("JSON File Not Found");

        }

        const json = await response.json();

        return {

            json,

            date

        };

    } catch (error) {

        console.error(error);

        return null;

    }

}

/**********************************************************************
 * Find Day Data
 **********************************************************************/

function findCurrentDay(data, date) {

    return data.days.find(item => item.id === date);

}

/**********************************************************************
 * Container
 **********************************************************************/

const newsContainer = document.getElementById("newsContainer");


/**********************************************************************
 * Render Static GK
 **********************************************************************/

function renderStaticGK(items = []) {

    if (!items.length) return "";

    return `
        <div class="static-gk">

            <h3>📖 Static GK</h3>

            <ul>

                ${items.map(item => `<li>${item}</li>`).join("")}

            </ul>

        </div>
    `;

}

/**********************************************************************
 * Render MCQs
 **********************************************************************/

function renderMCQs(mcqs = []) {

    if (!mcqs.length) return "";

    return `

        <div class="mcq-section">

            <h3>🎯 Practice MCQs</h3>

            ${mcqs.map((mcq, index) => `

                <div class="mcq">

                    <h4>

                        Q${index + 1}. ${mcq.question}

                    </h4>

                    <ul>

                        ${mcq.options.map(option => `

                            <li>${option}</li>

                        `).join("")}

                    </ul>

                    <p class="answer">

                        <strong>Answer :</strong>

                        ${mcq.answer}

                    </p>

                </div>

            `).join("")}

        </div>

    `;

}

/**********************************************************************
 * Render News Card
 **********************************************************************/

function renderNews(news) {

    return `

        <div class="news-card">

            <div class="news-category">

                ${news.category}

            </div>

            <h2>

                ${news.title}

            </h2>

            <p class="summary">

                ${news.summary}

            </p>

            <a

                href="${news.sourceUrl}"

                target="_blank"

                class="learn-btn">

                Learn More

            </a>

            ${renderStaticGK(news.staticGK)}

            ${renderMCQs(news.mcqs)}

        </div>

    `;

}

/**********************************************************************
 * Previous & Next Navigation
 **********************************************************************/

/**********************************************************************
 * Previous & Next Navigation
 **********************************************************************/

function updateNavigation(data, currentDay) {

    const prevBtn = document.getElementById("prevDay");
    const nextBtn = document.getElementById("nextDay");

    const currentIndex = data.days.findIndex(item => item.id === currentDay.id);

    // Previous Button
    if (currentIndex > 0) {

        const previousDay = data.days[currentIndex - 1];

        prevBtn.href = `day.html?id=${previousDay.id}`;
        prevBtn.innerHTML = `⬅ ${previousDay.date}`;

        prevBtn.classList.remove("disabled");

    } else {

        prevBtn.removeAttribute("href");
        prevBtn.innerHTML = "⬅ Previous Day";

        prevBtn.classList.add("disabled");

    }

    // Next Button
    if (currentIndex < data.days.length - 1) {

        const nextDay = data.days[currentIndex + 1];

        nextBtn.href = `day.html?id=${nextDay.id}`;
        nextBtn.innerHTML = `${nextDay.date} ➡`;

        nextBtn.classList.remove("disabled");

    } else {

        nextBtn.removeAttribute("href");
        nextBtn.innerHTML = "Next Day ➡";

        nextBtn.classList.add("disabled");

    }

}


/**********************************************************************
 * Initialize
 **********************************************************************/

/**********************************************************************
 * Display Current Day
 **********************************************************************/

async function displayCurrentAffairs() {

    const result = await loadCurrentAffairs();

    if (!result) {

        newsContainer.innerHTML = "<h2>Data Not Found</h2>";
        return;

    }

    const day = findCurrentDay(result.json, result.date);

    if (!day) {

        newsContainer.innerHTML = "<h2>No Current Affairs Available.</h2>";
        return;

    }

    /* =============================
       Header Date
    ============================== */

    const currentDate = document.getElementById("currentDate");

    if (currentDate) {

        currentDate.innerHTML =
            `${day.date} | UPSC | SSC | Railway | Banking | Defence`;

    }

    /* =============================
       Browser Title
    ============================== */

    document.title = `Daily Current Affairs | ${day.date}`;

    /* =============================
       Previous / Next Navigation
    ============================== */

    updateNavigation(result.json, day);

    /* =============================
       Render News
    ============================== */

    let html = "";

    day.news.forEach(news => {

        html += renderNews(news);

    });

    newsContainer.innerHTML = html;

}

/**********************************************************************
 * Initialize
 **********************************************************************/

displayCurrentAffairs();