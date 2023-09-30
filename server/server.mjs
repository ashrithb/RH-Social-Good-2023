import fs, { writeFileSync } from "fs";
import express, { json } from "express";
const app = express();
import { esgSummary } from "./openai.mjs";
import cors from "cors";

app.use(cors());
app.use(json());

const bin = fs.readFileSync("./data_final.json");
const { averageBySector, sectors, tickers } = JSON.parse(bin);

const bin2 = fs.readFileSync("./summaries.json");
const summaries = JSON.parse(bin2);

// (async () => {
// 	for (const ticker of Object.keys(tickers)) {
// 		const companyName = tickers[ticker];
// 		const m = await esgSummary(ticker);
// 		summaries[ticker] = m;
// 		console.log(m + "\n\n");
// 	}
// 	writeFileSync("./summaries.json", JSON.stringify(summaries));
// })();

app.get("/esg/:ticker", (req, res) => {
	let { ticker } = req.params;
	ticker = ticker.toUpperCase();

	console.log(`Got request! Ticker: ${ticker}`);
	const obj = tickers[ticker];
	if (obj) {
		const sector = obj["sector"];
		res.json({
			data: {
				score: obj["total"],
				environmental: obj["environmental"],
				governance: obj["governance"],
				social: obj["social"],
				sector: sector,
				sectorAverage: averageBySector[sector], // (E,S,G,T)
				topCompanies: sectors[sector].slice(0, 10),
				summary: summaries[ticker] || "Unknown",
			},
		});
	} else {
		res.json({
			data: {},
		});
	}
});

app.get("/esg/summary/:ticker", async (req, res) => {
	let { ticker } = req.params;
	ticker = ticker.toUpperCase();

	console.log(`Got summary request! Ticker: ${ticker}`);
	const obj = tickers[ticker];
	if (obj) {
		const companyName = obj["Name"];
		const summary = await esgSummary(companyName, ticker);
		res.json({
			data: { summary },
		});
	} else {
		res.json({
			data: null,
		});
	}
});

// app.post("/esg/portfolio", async (req, res) => {
// 	let { holdings } = req.body; // holdings = {ticker : float, ticker: float} float represents % of portfolio
// 	if (!holdings) {
// 		return res.json({ data: null });
// 	}
// 	let tscore,
// 		escore,
// 		sscore,
// 		gscore,
// 		percentage = 0;

// 	for (let ticker in holdings) {
// 		if (tickers[ticker] && tickers[tickers][total] != -1) {
// 			escore += holdings[ticker] * tickers[ticker]["environmental"];
// 			sscore += holdings[ticker] * tickers[ticker]["social"];
// 			gscore += holdings[ticker] * tickers[ticker]["governance"];
// 			tscore += holdings[ticker] * tickers[ticker]["total"];
// 			percentage += holdings[ticker];
// 		}
// 	}

// 	recip = percentage ? 1 / percentage : 1;
// 	tscore,
// 		escore,
// 		sscore,
// 		(gscore = tscore * recip),
// 		escore * recip,
// 		sscore * recip,
// 		gscore * recip;

// 	return res.json({
// 		data: {
// 			tscore,
// 			escore,
// 			sscore,
// 			gscore,
// 		},
// 	});
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
