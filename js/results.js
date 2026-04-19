window.onload = async function () {
    const savedData = localStorage.getItem("verifyMYData");

    if (savedData) {
        const data = JSON.parse(savedData);

        document.getElementById("resultName").textContent = data.applicantName || "-";
        document.getElementById("resultId").textContent = data.applicationId || "-";
        document.getElementById("readinessScore").textContent = data.readinessScore + "%";
        document.getElementById("recommendationText").textContent = data.recommendation || "-";

        const uploadedDocsList = document.getElementById("uploadedDocsList");
        const missingDocsList = document.getElementById("missingDocsList");
        const aiSummary = document.getElementById("aiSummary");

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

        if (aiSummary) {
            aiSummary.textContent = "Generating AI summary...";

            try {
                const response = await fetch("/api/gemini", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        applicantName: data.applicantName,
                        uploadedDocs: data.uploadedDocs,
                        missingDocs: data.missingDocs,
                        readinessScore: data.readinessScore,
                        priority: data.priority,
                        recommendation: data.recommendation
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    aiSummary.textContent = "AI summary is unavailable right now. Please review the uploaded and missing documents above.";
                    console.error(result);
                } else {
                    aiSummary.textContent = result.summary || "AI summary is unavailable right now.";
                }
            } catch (error) {
                aiSummary.textContent = "AI summary is unavailable right now. Please review the uploaded and missing documents above.";
                console.error(error);
            }
        }
    } else {
        document.querySelector(".card").innerHTML = `
            <h1>No Review Data Found</h1>
            <p class="subtitle">Please return to the upload page and submit your documents first.</p>
            <a href="upload.html" class="btn">Go to Upload Page</a>
        `;
    }
};