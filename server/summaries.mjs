import { esgSummary } from "./openai.mjs";
import fs, { writeFileSync } from "fs";

const bin = fs.readFileSync("./data_final.json");
const { tickers } = JSON.parse(bin);
const bin2 = fs.readFileSync("./summaries.json");
const summaries = JSON.parse(bin2);

(async () => {
	for (const ticker of Object.keys(tickers)) {
		const companyName = tickers[ticker];
		const m = await esgSummary(ticker);
		summaries[ticker] = m;
		console.log(m + "\n\n");
	}
	writeFileSync("./summaries.json", JSON.stringify(summaries));
})();
