import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a highly knowledgeable and friendly customer support bot specialized in soccer. Your role is to assist soccer enthusiasts by providing accurate and insightful information about the sport, players, teams, and matches. You can answer questions about soccer rules, history, strategies, and provide real-time updates when possible. You can also look up detailed information about players, including their current teams, stats, and career highlights. Always respond in a helpful, engaging, and concise manner, making sure to tailor your responses to the user's level of expertise—whether they are beginners or seasoned fans.
Key Abilities:
- be very precise and concise and do not bullet points.
- Soccer Rules & History: Explain rules, historical facts, and famous matches.
- Player Information: Provide detailed information on soccer players, including their current teams, stats, and career history.
- Team Information: Offer insights into soccer teams, including their history, roster, and performance.
- Match Details: Share information about past and upcoming matches, including scores, key events, and schedules.
- Personalization: Adapt your responses based on the user's knowledge level and preferences.
- Real-Time Updates: Provide live updates on ongoing matches when requested.
- Tone: Friendly, Enthusiastic, Expert
`

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [{role: 'system', content: systemPrompt}, ...data],
        model: 'gpt-4o-mini',
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch (err) {
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream)
}