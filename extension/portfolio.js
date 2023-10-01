console.log("Running portfolio script");
// Wait for full page to be loaded before querying for elements
function waitForElement(selector, timeout = 5000) {
	return new Promise((resolve, reject) => {
		const startTime = Date.now();

		function checkElement() {
			const element = document.querySelector(selector);
			if (element) {
				resolve(element);
			} else if (Date.now() - startTime > timeout) {
				reject(new Error("Timeout waiting for element"));
			} else {
				setTimeout(checkElement, 100); // Check again after a short delay
			}
		}

		checkElement();
	});
}

async function modifyElementContent() {
	try {
		const amountClass = "atrP1y1y_C9ULHV4BSwFj";
		const tickerClass = "_2-4BkMtIykh6hAhu1CkOAi";
		await waitForElement("." + amountClass);

		const amounts = document.getElementsByClassName(amountClass);
		const tickers = document.getElementsByClassName(tickerClass);
		const holdings = {};
		let total = 0;

		for (let i = 1; i < amounts.length; i++) {
			const amount = Number(amounts[i].textContent.replace(/[^0-9.-]+/g, ""));
			const ticker = tickers[i].textContent;
			holdings[ticker] = amount;
			total += amount;
		}

		for (const ticker of Object.keys(holdings)) {
			holdings[ticker] /= total;
		}

		const res = await getPortfolioScore(holdings);
		const { tscore, escore, sscore, gscore } = res.data;

		// ADD DOM ELEMENTS TO SHOW SCORES

		const esgDiv = document.createElement("div");
		esgDiv.className = "portfolio-score";

		const t = document.createElement("span");
		t.textContent = `ESG: ${tscore?.toFixed(2)}`;
		const e = document.createElement("span");
		e.textContent = `(E: ${escore?.toFixed(2)}`;
		const s = document.createElement("span");
		s.textContent = `S: ${sscore?.toFixed(2)}`;
		const g = document.createElement("span");
		g.textContent = `G: ${gscore?.toFixed(2)})`;

		t.style.marginRight = "10px";
		for (const el of [e, s, g]) {
			el.style.marginRight = "5px";
			el.style.fontSize = ".7em";
		}

		esgDiv.appendChild(t);
		esgDiv.appendChild(e);
		esgDiv.appendChild(s);
		esgDiv.appendChild(g);

		const ele = [...document.querySelectorAll(".css-z4smye")].filter(
			(el) => el.innerText == "Stocks"
		)[0];
		ele.insertBefore(esgDiv, ele.children[0]);
	} catch (error) {
		console.error("Error:", error.message);
	}
}
async function getPortfolioScore(holdings) {
	url = "https://rh-hackathon.uc.r.appspot.com/esg/portfolio";
	res = fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ holdings }),
	});
	response = await res;
	return await response.json();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", modifyElementContent);
} else {
	modifyElementContent();
}
