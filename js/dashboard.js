window.onload = function () {
    const savedData = localStorage.getItem("verifyMYData");

    if (savedData) {
        const data = JSON.parse(savedData);

        document.getElementById("dashName").textContent = data.applicantName || "-";
        document.getElementById("dashId").textContent = data.applicationId || "-";
        document.getElementById("dashScore").textContent = data.readinessScore + "%";
        document.getElementById("dashRecommendation").textContent = data.recommendation || "-";

        document.getElementById("dashUploadedCount").textContent =
            (data.uploadedCount || 0) + "/" + (data.totalDocs || 4);

        const statusElement = document.getElementById("dashStatus");
        statusElement.textContent = data.status || "-";
        statusElement.className = "kpi-value " + ((data.status === "Ready") ? "status-ready" : "status-incomplete");

        const priorityElement = document.getElementById("dashPriority");
        priorityElement.textContent = data.priority || "-";

        const priorityClass =
            data.priority === "Low" ? "priority-low" :
            data.priority === "Medium" ? "priority-medium" :
            "priority-high";

        priorityElement.className = "kpi-value " + priorityClass;

        const dashIssues = document.getElementById("dashIssues");
        dashIssues.innerHTML = "";

        if (data.missingDocs && data.missingDocs.length > 0) {
            data.missingDocs.forEach(function (doc) {
                const li = document.createElement("li");
                li.textContent = doc;
                dashIssues.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "No major issues detected.";
            dashIssues.appendChild(li);
        }
    } else {
        document.querySelector(".card").innerHTML = `
            <h1>No Dashboard Data Found</h1>
            <p class="subtitle">Please complete the upload and review process first.</p>
            <a href="upload.html" class="btn">Go to Upload Page</a>
        `;
        return;
    }

    const resetButton = document.getElementById("resetAppBtn");

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            localStorage.removeItem("verifyMYData");
            window.location.href = "index.html";
        });
    }
};