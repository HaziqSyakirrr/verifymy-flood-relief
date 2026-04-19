document.getElementById("uploadForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const applicantNameInput = document.getElementById("applicantName");
    const applicantName = applicantNameInput.value.trim();

    const icFile = document.getElementById("icFile").files.length > 0;
    const addressFile = document.getElementById("addressFile").files.length > 0;
    const damageFile = document.getElementById("damageFile").files.length > 0;
    const supportFile = document.getElementById("supportFile").files.length > 0;

    if (applicantName === "") {
        alert("Please enter applicant name.");
        applicantNameInput.focus();
        return;
    }

    if (!icFile && !addressFile && !damageFile && !supportFile) {
        alert("Please upload at least one document.");
        return;
    }

    const uploadedDocs = [];
    const missingDocs = [];

    if (icFile) {
        uploadedDocs.push("Identity Card (IC)");
    } else {
        missingDocs.push("Identity Card (IC)");
    }

    if (addressFile) {
        uploadedDocs.push("Proof of Address");
    } else {
        missingDocs.push("Proof of Address");
    }

    if (damageFile) {
        uploadedDocs.push("House Damage Photo");
    } else {
        missingDocs.push("House Damage Photo");
    }

    if (supportFile) {
        uploadedDocs.push("Supporting Statement / Report");
    } else {
        missingDocs.push("Supporting Statement / Report");
    }

    const totalDocs = 4;
    const uploadedCount = uploadedDocs.length;
    const readinessScore = (uploadedCount / totalDocs) * 100;

    let recommendation = "";
    let priority = "";
    let status = "";

    if (readinessScore === 100) {
        recommendation = "Application appears ready for officer review.";
        priority = "Low";
        status = "Ready";
    } else if (readinessScore === 75) {
        recommendation = "One required document is missing. Please complete the upload before submission.";
        priority = "Medium";
        status = "Incomplete";
    } else {
        recommendation = "Application is incomplete. Please upload the missing documents before proceeding.";
        priority = "High";
        status = "Incomplete";
    }

    const applicationData = {
        applicantName: applicantName,
        uploadedDocs: uploadedDocs,
        missingDocs: missingDocs,
        readinessScore: readinessScore,
        recommendation: recommendation,
        priority: priority,
        status: status,
        uploadedCount: uploadedCount,
        totalDocs: totalDocs,
        applicationId: "APP-" + Math.floor(Math.random() * 100000)
    };

    localStorage.setItem("verifyMYData", JSON.stringify(applicationData));

    window.location.href = "results.html";
});