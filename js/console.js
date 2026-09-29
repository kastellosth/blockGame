export function setupConsole() {
    const consoleOutput = document.querySelector("#consoleOutput");

    const originalLog = console.log;
    const originalError = console.error;
    console.clear();
    console.log = (...messages) => {
        originalLog(...messages);

        const line = document.createElement("div");
        line.classList.add("log");
        line.textContent = messages.join(" ");

        consoleOutput.appendChild(line);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    };

    console.error = (...messages) => {
        originalError(...messages);

        const line = document.createElement("div");
        line.classList.add("error");
        line.textContent = messages.join(" ");

        consoleOutput.appendChild(line);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    };

   
}