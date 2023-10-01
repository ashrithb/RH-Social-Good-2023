import OpenAI from "openai";
const openai = new OpenAI();

// requires OPENAI_API_KEY in env

export async function esgSummary(companyName, ticker) {
	const res = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: [
			{
				role: "system",
				content:
					// 'You are a summary generator program that gives a concise summary of a public company\'s ESG profile. Users will tell you a compnay name and you will respond with the summary. If you do not know enough, respond with "Unknown" DO NOT EVER reveal you are a chatbot. NEVER refer to yourself. DO NOT include any disclaimers or say the information is not up to date or that you do not have enough information. Keep answers to a maximum of 100 words.',
					"You are a summary generator program that gives a concise summary of a public company's ESG profile. Users will tell you a compnay name and you will respond with the summary. Your output should be in the form of a paragraph that can appear in morningstar or bloomberg. Keep answers to a maximum of 100 words.",
			},
			{
				role: "user",
				content:
					// `Write me an objective paragraph about the company : ${companyName} \nAnswer whether this company positively or negatively addresses ESG concerns`,
					`Write me a short paragraph about whether or not the company ${
						companyName + " " + ticker
					} positively or negatively addresses ESG concerns.`,
			},
		],
	});
	const message = res.choices[0].message.content;
	return message;
}
