/**********************************************************************
 * EXAM PORTAL
 * Current Affairs Home
 * script.js
 **********************************************************************/

"use strict";

const container = document.getElementById("currentAffairsContainer");

// URL से month पढ़ो
const params = new URLSearchParams(window.location.search);
const month = params.get("month") || "july-2026";

// Active Month Button
document.querySelectorAll(".month-btn").forEach(btn => {

    btn.classList.remove("active");

    const href = btn.getAttribute("href");

    if (href && href.includes(month)) {
        btn.classList.add("active");
    }

});

fetch(`../data/${month}.json`)
    .then(response => {

        if (!response.ok) {
            throw new Error("JSON File Not Found");
        }

        return response.json();

    })
    .then(data => {

        let html = "";

        data.days.forEach(item => {

            html += `
                <div class="day-card">

                    <div class="card-top">

                        <span class="date">
                            <i class="fa-regular fa-calendar"></i>
                            ${item.date}
                        </span>

                        <span class="news-count">
                            ${item.totalNews} News
                        </span>

                    </div>

                    <h2>
                        Daily Current Affairs
                    </h2>

                    <p>
                        Important National, International, Economy, Science, Sports and Government Scheme News.
                    </p>

                    <a href="../day/day.html?id=${item.id}" class="read-btn">
                        Read Current Affairs
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>

                </div>
            `;

        });

        container.innerHTML = html;

    })
    .catch(error => {

        console.error(error);

        container.innerHTML = `
            <div class="day-card">
                <h2>Current Affairs Not Found</h2>
                <p>Please check your JSON file and folder path.</p>
            </div>
        `;

    });