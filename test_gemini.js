const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyBBuipmrlrsoOv7NYdmM88EVE27-WXpDl8");

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
