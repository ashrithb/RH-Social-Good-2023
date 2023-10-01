console.log("Running cards script");

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

function getData(ticker) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		url = "https://rh-hackathon.uc.r.appspot.com/esg/" + ticker;
		xhr.open("GET", url, true);

		xhr.onload = function () {
			if (xhr.status === 200) {
				const responseData = JSON.parse(xhr.responseText);
				resolve(responseData["data"]);
			} else {
				reject(`Request failed with status ${xhr.status}`);
			}
		};

		xhr.onerror = function () {
			reject("Network error");
		};

		xhr.send();
	});
}

async function modifyElementContent() {
	try {
		await waitForElement(".BUhGgJ_y9SQoayndAg9pl");
		const cards = document.querySelectorAll(".BUhGgJ_y9SQoayndAg9pl");
		[...cards].forEach(async (c) => {
			const url = c.href;
			const parts = url.split("?")[0].split("/");
			const ticker = parts[parts.length - 1];

			const card = c.children[0];
			const el = card.children[0];
			const newDiv = document.createElement("div");

			// Fetch data for given company from endpoint
			const data = await getData(ticker);
			envScore = data["environmental"];
			socScore = data["social"];
			govScore = data["governance"];
			sectorAvg = data["sectorAverage"][3];
			sector = data["sector"];
			score = (envScore + socScore + govScore).toFixed();
			topCompanies = data["topCompanies"];

			if (envScore === undefined) {
				envScore = "No Data";
				socScore = "No Data";
				govScore = "No Data";
				score = sectorAvg.toFixed(2);
			}

			newDiv.textContent = "ESG Score: " + score;
			el.insertBefore(newDiv, el.children[1]);
		});
	} catch (error) {
		console.log("RH EXTENSION ERROR:", error.message);
	}
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", modifyElementContent);
} else {
	modifyElementContent();
}
