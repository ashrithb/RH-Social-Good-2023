import fs, { writeFileSync } from "fs";
import express from "express";
const app = express();
import { esgSummary } from "./openai.mjs";

const bin = fs.readFileSync("./data.json");
const bin2 = fs.readFileSync("./summaries.json");
const { keys, averageBySector, sectors, tickers } = JSON.parse(bin);
const summaries = JSON.parse(bin2);

// const summaries = {};
// (async () => {
// 	for (const ticker of Object.keys(tickers)) {
// 		const companyName = tickers[ticker];
// 		const m = await esgSummary(ticker);
// 		summaries[ticker] = m;
// 		console.log(summaries);
// 	}
// 	writeFileSync("./summaries.json", JSON.stringify(summaries));
// })();

app.get("/esg/:ticker", (req, res) => {
	let { ticker } = req.params;
	ticker = ticker.toUpperCase();

	console.log(`Got request! Ticker: ${ticker}`);
	const obj = tickers[ticker];
	if (obj) {
		const [T, E, G, S, C] = [
			obj["Total"],
			obj["Environment Risk Score"],
			obj["Governance Risk Score"],
			obj["Social Risk Score"],
			obj["Controversy Score"],
		];
		const sector = obj["Sector"];

		res.json({
			data: {
				summary: summaries[ticker],
				totalScore: T,
				environmental: E,
				governance: G,
				social: S,
				controversy: C,
				sectorAverage: averageBySector[sector],
				topCompanies: sectors[sector],
			},
		});
	} else {
		res.json({
			data: null,
		});
	}
});

app.get("/esg/news/:ticker", async (req, res) => {
	let { ticker } = req.params;
	ticker = ticker.toUpperCase();

	console.log(`Got summary request! Ticker: ${ticker}`);
	const obj = tickers[ticker];
	if (obj) {
		const companyName = obj["Name"];
		const summary = await esgSummary(companyName);
		res.json({
			data: { summary },
		});
	} else {
		res.json({
			data: null,
		});
	}
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
