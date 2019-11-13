const engine = new Engine();
sendMessage("The JavaScript loaded correctly!");

function process() {
    sendMessage(engine.parse(document.getElementById("input").value));
}

function sendMessage(msg) {
    document.getElementById("message").innerHTML = msg;
}

function toggleDarkMode() {
    const body = document.getElementById("body");
    if (body.classList.contains("darkMode")) {
        body.classList.remove("darkMode");
    } else {
        body.classList.add("darkMode");
    }
}