require("dotenv").config({ path: ".env.local" });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("ERROR: GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    await model.generateContent("Hi");
    console.log(modelName + ": SUCCESS");
  } catch (e) {
    console.log(modelName + ": ERROR -> " + e.message);
  }
}

async function run() {
  await testModel("gemini-1.5-flash");
  await testModel("gemini-2.5-flash");
  await testModel("gemini-2.0-flash");
  await testModel("gemini-1.5-flash-latest");
}

run();
