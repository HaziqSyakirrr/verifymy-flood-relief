export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const {
            applicantName = "Applicant",
            uploadedDocs = [],
            missingDocs = [],
            readinessScore = 0,
            priority = "Unknown",
            recommendation = ""
        } = req.body || {};

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
        }

        const prompt = `
You are an assistant for a government-style flood relief document portal called VerifyMY.

Write one short, clear paragraph in English for the applicant.
Explain:
1. why the application is marked as Ready or Incomplete,
2. what documents are missing, if any,
3. what the applicant should do next.

Keep it simple, formal, and helpful.
Do not use bullet points.
Do not mention internal system logic.
Do not invent documents that are not listed.

Application data:
Applicant Name: ${applicantName}
Uploaded Documents: ${uploadedDocs.join(", ") || "None"}
Missing Documents: ${missingDocs.join(", ") || "None"}
Readiness Score: ${readinessScore}%
Priority: ${priority}
Current Recommendation: ${recommendation}
        `.trim();

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Gemini request failed",
                details: data
            });
        }

        const summary =
            data?.candidates?.[0]?.content?.parts
                ?.map(part => part.text || "")
                .join(" ")
                .trim() || "AI summary could not be generated.";

        return res.status(200).json({ summary });
    } catch (error) {
        return res.status(500).json({
            error: "Server error",
            details: error.message
        });
    }
}