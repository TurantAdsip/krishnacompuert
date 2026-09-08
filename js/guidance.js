function showEnglish() {
    document.getElementById("english").style.display = "block";
    document.getElementById("hindi").style.display = "none";
}

function showHindi() {
    document.getElementById("english").style.display = "none";
    document.getElementById("hindi").style.display = "block";
}

document.addEventListener("DOMContentLoaded", function() {
    showEnglish();
});

// function showEnglish() {

//     document.getElementById("english").style.display = "block";
//     document.getElementById("hindi").style.display = "none";

//     document.querySelector(".language-btn button:nth-child(1)").classList.add("active");
//     document.querySelector(".language-btn button:nth-child(2)").classList.remove("active");
// }


// function showHindi() {

//     document.getElementById("english").style.display = "none";
//     document.getElementById("hindi").style.display = "block";

//     document.querySelector(".language-btn button:nth-child(1)").classList.remove("active");
//     document.querySelector(".language-btn button:nth-child(2)").classList.add("active");
// }