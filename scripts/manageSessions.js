document.addEventListener("DOMContentLoaded", () => {
    const sessionsTableBody = document.getElementById("sessionsTableBody");
    const addSessionForm = document.getElementById("addSessionForm");

    // Function to add a session row to the table
    function addSessionToTable(sessionId, course, sessionType, dateTime) {
        // Create a new row
        const newRow = document.createElement("tr");
        newRow.id = sessionId;

        // Add the row contents
        newRow.innerHTML = `
            <td>${course}</td>
            <td>${sessionType}</td>
            <td>${dateTime}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="enterSession('${sessionId}')">Enter Session</button>
                <button class="btn btn-danger btn-sm" onclick="deleteSession('${sessionId}')">Delete</button>
            </td>
        `;

        // Append the new row to the table
        sessionsTableBody.appendChild(newRow);
    }

    // Add event listener to handle form submission
    addSessionForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get form values
        const course = document.getElementById("courseSelect").value;
        const dateTime = document.getElementById("dateTimePicker").value;
        const sessionType = document.querySelector("input[name='sessionType']:checked").value;

        // Generate unique session ID based on current timestamp
        const sessionId = `sessionID${Date.now()}`;

        // Format the datetime
        const formattedDateTime = new Date(dateTime).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        });

        // Add new session row to the table
        addSessionToTable(sessionId, course, sessionType, formattedDateTime);

        // Close the modal after session is added
        const addSessionModal = bootstrap.Modal.getInstance(document.getElementById("addSessionModal"));
        addSessionModal.hide();

        // Reset the form for the next session
        addSessionForm.reset();
    });

    // Function to delete a session row
    window.deleteSession = (sessionId) => {
        const row = document.getElementById(sessionId);
        if (row) {
            row.remove(); // Remove the row from the table
        }
    };

    // Placeholder for entering a session
    window.enterSession = (sessionId) => {
        alert(`Entering session: ${sessionId}`);
        // Add any logic for entering the session here
    };
});