function loadbookings() {
    // Get the "User" object from localStorage
    const userString = localStorage.getItem("User");

    if (userString) {
        try {
            // Parse the JSON string
            const userObject = JSON.parse(userString);

            // Check if "username" exists in the parsed object
            if (userObject && userObject.username) {
                const username = userObject.username; // Extract the username
                const userKey = `bookings_${username}`; // Unique key for the user's sessions

                // Retrieve the sessions list
                const bookings = JSON.parse(localStorage.getItem(userKey)) || [];
                
                // Call addSessionToTable for each session
                bookings.forEach(booking => {
                    const { sessionId, course, sessionType, dateTime, booked,name } = booking;
                    const formattedDateTime = new Date(dateTime).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    });
                    addBookingToTable(sessionId, course, sessionType,formattedDateTime, booked, name);
                });
            } 
        } catch (error) {
            console.log("Error parsing User object from localStorage:", error);
        }
    } 
}

function addBookingToTable(sessionId, course, sessionType, dateTime, Booked, name) {
    // Create a new row
    const newRow = document.createElement("tr");
    newRow.id = sessionId;

    // Add the row contents
    newRow.innerHTML = `
        <td>${course}</td>
        <td>${sessionType}</td>
        <td>${dateTime}</td>
        <td>${name}</td>
        <td>
            <button class="btn btn-info btn-sm" onclick="enterSession('${sessionId}')">Enter Session</button>
            <button class="btn btn-danger btn-sm" onclick="deletebooking('${sessionId}')">Delete</button>
        </td>
    `;

    // Append the new row to the table
    document.getElementById("bookingsTableBody").appendChild(newRow);
}

document.addEventListener("DOMContentLoaded", loadbookings);
function deleteSessionFromAllUsersAndUnbookInTutor(sessionId) {
    try {
        const usersString = localStorage.getItem("users");
        if (!usersString) {
            console.error("No users found in localStorage.");
            return;
        }

        const users = JSON.parse(usersString);

        // Loop through each user
        users.forEach(user => {
            const username = user.username;
            const bookingsKey = `bookings_${username}`;

            // Check if the user has bookings and remove the session
            const bookingsString = localStorage.getItem(bookingsKey);
            const bookings = bookingsString ? JSON.parse(bookingsString) : [];

            const updatedBookings = bookings.filter(booking => booking.sessionId !== sessionId);

            // Update bookings if the session was found
            if (updatedBookings.length !== bookings.length) {
                localStorage.setItem(bookingsKey, JSON.stringify(updatedBookings));
                console.log(`Deleted session ${sessionId} from bookings of user: ${username}`);
            }

            // If the user is a tutor, check their sessions
            if (user.role === "Tutor") {
                const tutorSessionsKey = `sessions_${username}`;
                const tutorSessionsString = localStorage.getItem(tutorSessionsKey);
                const tutorSessions = tutorSessionsString ? JSON.parse(tutorSessionsString) : [];

                // Find and update the session in the tutor's list
                const sessionIndex = tutorSessions.findIndex(session => session.sessionId === sessionId);
                if (sessionIndex > -1) {
                    tutorSessions[sessionIndex].booked = "No";
                    localStorage.setItem(tutorSessionsKey, JSON.stringify(tutorSessions));
                    console.log(`Set booked status to No for session ${sessionId} in tutor's sessions (${username}).`);
                }
            }
        });
    } catch (error) {
        console.error("Error handling session removal and unbooking:", error);
    }
}
    // Function to delete a session row
    window.deletebooking = (sessionId) => {
        const row = document.getElementById(sessionId);
        if (row) {
            row.remove(); // Remove the row from the table
        }
        deleteSessionFromAllUsersAndUnbookInTutor(sessionId);

    };

