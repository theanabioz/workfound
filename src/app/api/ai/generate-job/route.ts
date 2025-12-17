import { NextResponse } from 'next/server';

// Если будет ключ, раскомментируй и используй GoogleGenerativeAI
// import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { title } = await req.json();

  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

  // MOCK AI GENERATION (Replace with real call)
  const mockDescription = `
**Вакансия: ${title}**

Мы ищем опытного специалиста на должность **${title}**. 
Если вы ответственны, пунктуальны и готовы работать в динамичной среде — мы ждем вас!

**Обязанности:**
• Выполнение поставленных задач в срок.
• Соблюдение стандартов качества.
• Работа в команде.

**Требования:**
• Опыт работы от 1 года.
• Желание развиваться.
• Ответственность.

**Мы предлагаем:**
• Конкурентную заработную плату.
• Дружный коллектив.
• Возможности для карьерного роста.
  `.trim();

  // Имитация задержки
  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json({ text: mockDescription });
}
