import OpenAI from "openai";
const openai = new OpenAI();

// requires OPENAI_API_KEY in env

export async function esgSummary(companyName) {
	const res = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: [
			{
				role: "system",
				content:
					'You are an impersonal assistant that gives a concise professonial summary of a public company\'s ESG profile. Users will tell you a compnay name and you will respond with the summary. If you do not know enough, respond with "Unknown" DO NOT EVER reveal you are a chatbot. NEVER refer to yourself. DO NOT include any disclaimers or say the information is not up to date. Keep answers to a maximum of 100 words.',
			},
			{ role: "user", content: companyName },
		],
	});
	const message = res.choices[0].message.content;
	return message;
}
