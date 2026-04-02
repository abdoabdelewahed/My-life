import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export const chatWithExpert = async (message: string, history: { role: string; parts: { text: string }[] }[]) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `أنت خبير عالمي في تصميم التطبيقات، ريادة الأعمال، وعلم النفس المالي. 
      مهمتك هي مساعدة المستخدم على التحول من الفقر إلى الثراء كمصمم تطبيقات في عام 2026.
      تحدث باللغة العربية بلهجة ملهمة وعملية. 
      ركز على: 
      1. مهارات التصميم الحديثة (AI-driven design).
      2. عقلية الوفرة وتغيير العادات المالية.
      3. كيفية الحصول على عملاء دوليين والعمل الحر.
      4. استغلال أدوات الذكاء الاصطناعي لمضاعفة الإنتاجية.`,
    },
    history: history,
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};

export const explainSimply = async (content: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `اشرح هذا المحتوى التعليمي بأسلوب بسيط جداً وواضح، واستخدم أمثلة واقعية من حياة المصممين والمطورين في عام 2026. اجعل الشرح قصيراً ومباشراً:
    
    المحتوى:
    ${content}`,
    config: {
      systemInstruction: "أنت معلم ذكي ومبسط للمفاهيم المعقدة. هدفك هو جعل التعلم ممتعاً وسهلاً لأي شخص.",
    },
  });
  return response.text;
};
