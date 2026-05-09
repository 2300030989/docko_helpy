import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { symptoms } = await req.json();

    if (!symptoms) {
      return NextResponse.json({ error: "Symptoms are required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("No GEMINI_API_KEY found, returning demo results.");
      return NextResponse.json({
        specialty: 'Neurologist', icon: '🧠',
        reason: 'The combination of one-sided headache, nausea, and light sensitivity is a classic presentation of migraine disorder or a vascular condition. A neurologist can conduct imaging and specialist assessment to rule out more serious causes.',
        urgency: 'see_soon', urgency_label: 'See Soon',
        also_consider: ['Ophthalmologist', 'General Physician'],
        self_care: 'Rest in a dark, quiet room. Stay hydrated and avoid screens. OTC pain relief (paracetamol) may help short-term.',
        emergency_signs: 'Sudden thunderclap headache, loss of consciousness, one-sided weakness, facial drooping, or slurred speech — these require an immediate ER visit.'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a medical triage assistant. Based on the symptoms, respond ONLY with a valid JSON object (no markdown, no extra text):
{"specialty":"Doctor type","icon":"relevant emoji","reason":"2-sentence explanation","urgency":"emergency|see_soon|routine","urgency_label":"Emergency|See Soon|Routine","also_consider":["Specialist 1","Specialist 2"],"self_care":"Brief tip","emergency_signs":"Signs requiring ER"}

Patient symptoms: ${symptoms}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJSON = responseText.replace(/```json|```/g, '').trim();

    return NextResponse.json(JSON.parse(cleanJSON));
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze symptoms." }, { status: 500 });
  }
}
