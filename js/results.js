window.onload = function () {
    const savedData = localStorage.getItem("verifyMYData");

    if (savedData) {
        const data = JSON.parse(savedData);

        document.getElementById("resultName").textContent = data.applicantName || "-";
        document.getElementById("resultId").textContent = data.applicationId || "-";
        document.getElementById("readinessScore").textContent = data.readinessScore + "%";
        document.getElementById("recommendationText").textContent = data.recommendation || "-";

        const uploadedDocsList = document.getElementById("uploadedDocsList");
        const missingDocsList = document.getElementById("missingDocsList");

        uploadedDocsList.innerHTML = "";
        missingDocsList.innerHTML = "";

        const uploadedCount = data.uploadedDocs ? data.uploadedDocs.length : 0;
        const totalDocs = 4;

        document.getElementById("uploadedCount").textContent = uploadedCount + "/" + totalDocs;

        let status = "Incomplete";
        if (data.readinessScore === 100) {
            status = "Ready";
        }

        const statusElement = document.getElementById("statusText");
        statusElement.textContent = status;
        statusElement.className = "kpi-value " + (status === "Ready" ? "status-ready" : "status-incomplete");

        const priorityElement = document.getElementById("priorityText");
        priorityElement.textContent = data.priority || "-";

        const priorityClass =
            data.priority === "Low" ? "priority-low" :
            data.priority === "Medium" ? "priority-medium" :
            "priority-high";

        priorityElement.className = "kpi-value " + priorityClass;

        if (data.uploadedDocs && data.uploadedDocs.length > 0) {
            data.uploadedDocs.forEach(function (doc) {
                const li = document.createElement("li");
                li.textContent = doc;
                uploadedDocsList.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "No documents uploaded.";
            uploadedDocsList.appendChild(li);
        }

        if (data.missingDocs && data.missingDocs.length > 0) {
            data.missingDocs.forEach(function (doc) {
                const li = document.createElement("li");
                li.textContent = doc;
                missingDocsList.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "No missing documents.";
            missingDocsList.appendChild(li);
        }
    } else {
        document.querySelector(".card").innerHTML = `
            <h1>No Review Data Found</h1>
            <p class="subtitle">Please return to the upload page and submit your documents first.</p>
            <a href="upload.html" class="btn">Go to Upload Page</a>
        `;
    }
};