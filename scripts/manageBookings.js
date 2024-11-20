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
            <button class="btn btn-danger btn-sm" onclick="deleteSession('${sessionId}')">Delete</button>
        </td>
    `;

    // Append the new row to the table
    document.getElementById("bookingsTableBody").appendChild(newRow);
}

document.addEventListener("DOMContentLoaded", loadbookings);

    // Function to delete a session row
    window.deletebooking = (sessionId) => {
        const row = document.getElementById(sessionId);
        if (row) {
            row.remove(); // Remove the row from the table
        }
        const currentUser = JSON.parse(localStorage.getItem("User")).username;

        const userKey = `bookings_${currentUser}`; // Unique key for the current user's sessions

        // Retrieve the existing sessions list
        const bookings = JSON.parse(localStorage.getItem(userKey)) || [];

        // Filter out the session with the specified ID
        const updatedbookings = bookings.filter(booking => booking.sessionId !== sessionId);

        // Update the sessions list in localStorage
        localStorage.setItem(userKey, JSON.stringify(updatedbookings));

    };

