process.env.GOOGLE_APPLICATION_CREDENTIALS = "";
const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["score", "strengths", "weaknesses"],
};
console.log("Checking API Key existence:", !!process.env.GEMINI_API_KEY);
const analyzeResume = async (resumeText, jobDescription) => {
  const prompt = `You are a strict tech recruiter. Compare the candidate's Resume to the Job Description. Score the match from 0-100, list 3 strengths that match the JD, and list 3 weaknesses or missing skills.

Job Description:
${jobDescription}

Resume:
${resumeText}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash", // Updated to the latest available model
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const analysis = JSON.parse(response.text);

  if (
    typeof analysis.score !== "number" ||
    !Array.isArray(analysis.strengths) ||
    !Array.isArray(analysis.weaknesses)
  ) {
    throw new Error("Invalid analysis format from AI.");
  }

  return analysis;
};

module.exports = { analyzeResume };
