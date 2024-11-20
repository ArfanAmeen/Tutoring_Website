function loadSessions() {
    // Get the "User" object from localStorage
    const userString = localStorage.getItem("User");

    if (userString) {
        try {
            // Parse the JSON string
            const userObject = JSON.parse(userString);

            // Check if "username" exists in the parsed object
            if (userObject && userObject.username) {
                const username = userObject.username; // Extract the username
                const userKey = `sessions_${username}`; // Unique key for the user's sessions

                // Retrieve the sessions list
                const sessions = JSON.parse(localStorage.getItem(userKey)) || [];

                // Call addSessionToTable for each session
                sessions.forEach(session => {
                    const { sessionId, course, sessionType, dateTime, booked,name } = session;

                    const formattedDateTime = new Date(dateTime).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    });
                    addSessionToTable(sessionId, course, sessionType,formattedDateTime, booked, name);
                });
            } 
        } catch (error) {
            console.log("Error parsing User object from localStorage:", error);
        }
    } 
}

function addSessionToTable(sessionId, course, sessionType, dateTime, Booked, name) {
    // Create a new row
    const newRow = document.createElement("tr");
    newRow.id = sessionId;

    // Add the row contents
    newRow.innerHTML = `
        <td>${course}</td>
        <td>${sessionType}</td>
        <td>${dateTime}</td>
        <td>${Booked}</td>
        <td>
            <button class="btn btn-info btn-sm" onclick="enterSession('${sessionId}')">Enter Session</button>
            <button class="btn btn-danger btn-sm" onclick="deleteSession('${sessionId}')">Delete</button>
        </td>
    `;

    // Append the new row to the table
    document.getElementById("sessionsTableBody").appendChild(newRow);
}

document.addEventListener("DOMContentLoaded", loadSessions);




document.addEventListener("DOMContentLoaded", () => {
    const sessionsTableBody = document.getElementById("sessionsTableBody");
    const addSessionForm = document.getElementById("addSessionForm");

    // Function to add a session row to the table
    function addSessionToTable(sessionId, course, sessionType, dateTime,booked) {
        // Create a new row
        const newRow = document.createElement("tr");
        newRow.id = sessionId;

        // Add the row contents
        newRow.innerHTML = `
            <td>${course}</td>
            <td>${sessionType}</td>
            <td>${dateTime}</td>
            <td>${booked}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="enterSession('${sessionId}')">Enter Session</button>
                <button class="btn btn-danger btn-sm" onclick="deleteSession('${sessionId}')">Delete</button>
            </td>
        `;

        // Append the new row to the table
        document.getElementById("sessionsTableBody").appendChild(newRow);
    }

    // Add event listener to handle form submission
    document.getElementById("addSessionForm").addEventListener("submit", (e) => {
        e.preventDefault();

        // Get form values
        const course = document.getElementById("courseSelect").value;
        const dateTime = document.getElementById("dateTimePicker").value;
        const sessionType = document.querySelector("input[name='sessionType']:checked").value;

        // Generate unique session ID based on current timestamp
        const sessionId = `sessionID${Date.now()}`;

        const currentUser = JSON.parse(localStorage.getItem("User")).username;

        const userKey = `sessions_${currentUser}`; // Unique key for the current user's sessions
        
        // Check if the sessions list exists for the current user
        if (!localStorage.getItem(userKey)) {
            localStorage.setItem(userKey, JSON.stringify([]));
            }
        


        // Format the datetime
        const formattedDateTime = new Date(dateTime).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        });
        // Add new session row to the table
        const name = JSON.parse(localStorage.getItem("User")).name

        addSessionToTable(sessionId, course, sessionType, formattedDateTime,booked = "No", name);
    
        // Retrieve the existing sessions list, or initialize an empty array if not found
        const sessions = JSON.parse(localStorage.getItem(userKey)) || [];
        // Create a new session object
        const newSession = {
            sessionId,
            course,
            dateTime,
            sessionType,
            booked,
            name
        };
    
        // Add the new session to the sessions list
        sessions.push(newSession);
    
        // Store the updated sessions list in localStorage
        localStorage.setItem(userKey, JSON.stringify(sessions));
    
        console.log(userKey)

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
        const currentUser = JSON.parse(localStorage.getItem("User")).username;

        const userKey = `sessions_${currentUser}`; // Unique key for the current user's sessions

        // Retrieve the existing sessions list
        const sessions = JSON.parse(localStorage.getItem(userKey)) || [];

        // Filter out the session with the specified ID
        const updatedSessions = sessions.filter(session => session.sessionId !== sessionId);

        // Update the sessions list in localStorage
        localStorage.setItem(userKey, JSON.stringify(updatedSessions));

    };

    // Placeholder for entering a session
    window.enterSession = (sessionId) => {
        alert(`Entering session: ${sessionId}`);
        // Add any logic for entering the session here
    };
});
