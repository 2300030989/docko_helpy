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
        possible_conditions: ['Migraine', 'Tension Headache', 'Cluster Headache'],
        reason: 'The combination of one-sided headache, nausea, and light sensitivity is a classic presentation of migraine disorder. A neurologist can conduct imaging and specialist assessment to rule out more serious causes like intracranial hypertension.',
        urgency: 'see_soon', urgency_label: 'See Soon',
        also_consider: ['Ophthalmologist', 'General Physician'],
        recommended_tests: ['MRI Brain (without contrast)', 'Complete Blood Count (CBC)', 'Blood Pressure Check', 'Eye Pressure Test'],
        medicines_to_avoid: ['Opioids (may worsen rebound headaches)', 'Aspirin (if under 18)', 'Overuse of NSAIDs'],
        diet_tips: 'Stay well-hydrated. Avoid caffeine withdrawal, alcohol, and aged cheeses which are common migraine triggers. Eat meals at regular intervals.',
        recovery_timeline: 'Acute migraine episode: 4–72 hours. With proper treatment and lifestyle changes, frequency can reduce significantly within 1–3 months.',
        questions_for_doctor: ['How often should I expect headaches?', 'Should I start preventive medication?', 'Are my headaches related to stress or hormones?'],
        self_care: 'Rest in a dark, quiet room. Apply a cold or warm compress to your forehead. Stay hydrated and avoid screens. OTC paracetamol may help short-term.',
        emergency_signs: 'Sudden thunderclap headache, loss of consciousness, one-sided weakness or numbness, facial drooping, slurred speech, or fever with stiff neck — these require an immediate ER visit.'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert medical triage assistant. Analyze the patient symptoms carefully and respond ONLY with a valid JSON object (no markdown, no extra text, no code fences). Be thorough, specific, and precise in your medical assessment.

Required JSON structure:
{
  "specialty": "Primary doctor specialty to consult",
  "icon": "Single most relevant medical emoji",
  "possible_conditions": ["Most likely condition", "Second possibility", "Third possibility"],
  "reason": "3-4 sentence detailed medical explanation of why these symptoms suggest this specialty, including the underlying pathophysiology",
  "urgency": "emergency|see_soon|routine",
  "urgency_label": "Emergency|See Soon|Routine",
  "also_consider": ["Alternative specialist 1", "Alternative specialist 2", "Alternative specialist 3"],
  "recommended_tests": ["Specific medical test 1", "Specific medical test 2", "Specific medical test 3", "Specific medical test 4"],
  "medicines_to_avoid": ["Medicine or class to avoid and brief reason", "Another medicine to avoid"],
  "diet_tips": "Specific dietary advice relevant to the suspected conditions, including foods to eat and avoid",
  "recovery_timeline": "Realistic expected recovery timeline with and without treatment",
  "questions_for_doctor": ["Key question patient should ask their doctor 1", "Key question 2", "Key question 3"],
  "self_care": "Detailed step-by-step self-care instructions for immediate relief",
  "emergency_signs": "Specific warning signs that require immediate ER visit, listed clearly"
}

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
