const fs = require("fs");
const express = require("express");
const app = express();

const bin = fs.readFileSync("./data.json");
const { keys, averageBySector, sectors, tickers } = JSON.parse(bin);

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
			totalScore: T,
			environmental: E,
			governance: G,
			social: S,
			controversy: C,
			sectorAverage: averageBySector[sector],
			topCompanies: sectors[sector],
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
