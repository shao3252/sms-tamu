document.getElementById("year").textContent = new Date().getFullYear();

const welcomeSection = document.getElementById("welcomeSection");
const loginSection = document.getElementById("loginSection");
const forgotSection = document.getElementById("forgotSection");

document.getElementById("welcomeButton").addEventListener("click", function () {
    welcomeSection.hidden = true;
    loginSection.hidden = false;
});

document.getElementById("backButton").addEventListener("click", function () {
    loginSection.hidden = true;
    welcomeSection.hidden = false;
    document.getElementById("loginNotice").hidden = true;
});

document.getElementById("forgotButton").addEventListener("click", function () {
    loginSection.hidden = true;
    forgotSection.hidden = false;
});

document.getElementById("forgotBackButton").addEventListener("click", function () {
    forgotSection.hidden = true;
    loginSection.hidden = false;
    document.getElementById("forgotNotice").hidden = true;
});

// Akaunti ya demo ya preview pekee; usitumie password hii kwenye akaunti halisi.
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const loginId = document.getElementById("loginId").value.trim();
    const password = document.getElementById("password").value;
    const demoAccounts = ["smsdemo", "0712345678"];
    const notice = document.getElementById("loginNotice");

    if (demoAccounts.includes(loginId) && password === "123456") {
        notice.textContent = "Umeingia kwa mafanikio kwenye preview ya SMS TAMU!";
    } else {
        notice.textContent = "Username/namba au password si sahihi. Tumia akaunti ya demo.";
    }

    notice.hidden = false;
});

document.getElementById("forgotForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const notice = document.getElementById("forgotNotice");
    notice.textContent = "Hii ni preview tu. Urejeshaji wa password utaunganishwa na database baadaye.";
    notice.hidden = false;
});
