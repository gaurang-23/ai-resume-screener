const fs = require("fs").promises;
const { PDFParse } = require("pdf-parse");
const { Resume } = require("../models");
const { analyzeResume } = require("../services/geminiService");

const extractTextFromPdf = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result.text.trim();
};

const uploadAndAnalyze = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required." });
    }

    const { jobDescription } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ message: "Job description is required." });
    }

    filePath = req.file.path;

    const resumeText = await extractTextFromPdf(filePath);

    if (!resumeText) {
      return res
        .status(400)
        .json({ message: "Could not extract text from PDF." });
    }

    const analysis = await analyzeResume(resumeText, jobDescription.trim());

    const resume = await Resume.create({
      userId: req.user.id,
      filename: req.file.originalname,
      jobDescription: jobDescription.trim(),
      analysis,
    });

    res.status(201).json({
      message: "Resume analyzed successfully.",
      resume: {
        id: resume.id,
        filename: resume.filename,
        jobDescription: resume.jobDescription,
        analysis: resume.analysis,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("Upload/analyze error:", error.message);

    if (error instanceof SyntaxError) {
      return res
        .status(502)
        .json({ message: "AI returned invalid JSON. Please try again." });
    }

    res.status(500).json({ message: "Server error during resume analysis." });
  } finally {
    if (filePath) {
      await fs.unlink(filePath).catch(() => {});
    }
  }
};

const getHistory = async (req, res) => {
  try {
    const resumes = await Resume.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "filename", "jobDescription", "analysis", "createdAt"],
    });

    res.json({ resumes });
  } catch (error) {
    console.error("History error:", error.message);
    res.status(500).json({ message: "Server error fetching resume history." });
  }
};

module.exports = {
  uploadAndAnalyze,
  getHistory,
};
