// Wait for full page to be loaded before querying for elements
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
  
      function checkElement() {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout waiting for element'));
        } else {
          setTimeout(checkElement, 100);  // Check again after a short delay
        }
      }
  
      checkElement();
    });
  }

// Fetch data for given ticker via API call
/*
function getData(ticker){
  const xhttpr = new XMLHttpRequest();
  url = "https://rh-hackathon.uc.r.appspot.com/esg/" + ticker;
  console.log(url);
  xhttpr.open('GET', url, true);
  xhttpr.send();
  
  xhttpr.onload = ()=> {
    if (xhttpr.status === 200) {
        console.log("Got here");
        const response = JSON.parse(xhttpr.response);
        console.log(response["data"]["environmental"]);
        return response["data"];
    } else {
        console.error("Error in GET request");
    }
  }
}
*/

function getData(ticker) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    url = "https://rh-hackathon.uc.r.appspot.com/esg/" + ticker;
    xhr.open('GET', url, true);

    xhr.onload = function() {
      if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.responseText);
        resolve(responseData["data"]);
      } else {
        reject(`Request failed with status ${xhr.status}`);
      }
    };

    xhr.onerror = function() {
      reject('Network error');
    };

    xhr.send();
  });
}

  
async function modifyElementContent() {
    try {
        const prevSection = await waitForElement('section#analyst-ratings');

        const newSection = document.createElement('section');
        newSection.id = "esg-ratings";
        newSection.classList.add("css-1d1twae");

        // Copied class names from other sections for header: "ESG Ratings"
        const heading = document.createElement('header');
        heading.classList.add("_94iM5HWDB72LT1b9epl3z");
        heading.classList.add("Ro25OxE3PLCUoBs5bAq7F");
        newSection.appendChild(heading);

        const div1 = document.createElement('div');
        div1.classList.add("coFkNkwfv2UsqxmbCFmXQ")
        heading.appendChild(div1)

        const div2 = document.createElement('div');
        div2.classList.add("_2vY3Zf9GdnlGIEOREiYwrF");
        div1.appendChild(div2);

        const h2 = document.createElement('h2');
        h2.classList.add("web-app-emotion-cache-1xmk3eg");
        div2.appendChild(h2);

        const sectionTitle = document.createElement('span');
        sectionTitle.classList.add("css-1qf1rvp");
        sectionTitle.innerHTML = "ESG Ratings"
        h2.appendChild(sectionTitle);


        // Obtain ticker from URL
        url = String(window.location.href);
        arr = url.split('/');
        url = arr[arr.length - 1];
        if (url.includes("?")){
          arr = url.split('?');
          url = arr[0];
        }
        ticker = url.toLowerCase();


        const data = await getData(ticker);
        envScore = data["environmental"];
        socScore = data["social"];
        govScore = data["governance"];
        summary = data["summary"];
        sectorAvg = data["sectorAverage"][3];
        sector = data["sector"];
        score = envScore + socScore + govScore;
        topCompanies = ['A', 'B', 'C', 'D', 'E'];
      


        // Body of ESG section
        const bodyDiv = document.createElement('div');
        bodyDiv.classList.add("css-zjik7");
        newSection.appendChild(bodyDiv);

        // Left Side of Body
        const leftDiv = document.createElement('div');
        leftDiv.classList.add("css-1mror65");
        bodyDiv.appendChild(leftDiv);
        
        // Total Score Circle
        circleDiv = document.createElement('div');
        circleDiv.classList.add("css-ctwg3s");
        circleDiv.id = "circle";
        leftDiv.appendChild(circleDiv);

        totalScore = document.createElement('h1');
        totalScore.classList.add("web-app-emotion-cache-ksarv1");
        totalScore.id = "totalScore";
        totalScore.innerHTML = score;
        circleDiv.appendChild(totalScore);

        circleLabel = document.createElement('span');
        circleLabel.classList.add("web-app-emotion-cache-1tp0q7s");
        circleLabel.classList.add("css-v72tci");
        circleLabel.id = "circleLabel";
        circleLabel.innerHTML = "Total Score";
        circleDiv.appendChild(circleLabel);

        // Industry Avg Circle
        industryCircle = document.createElement('div');
        industryCircle.classList.add("css-ctwg3s");
        industryCircle.id = "industry-circle";
        leftDiv.appendChild(industryCircle);

        industryScore = document.createElement('h1');
        industryScore.classList.add("web-app-emotion-cache-ksarv1");
        industryScore.id = "industryScore";
        industryScore.innerHTML = sectorAvg.toFixed(2);
        industryCircle.appendChild(industryScore);

        industryLabel = document.createElement('span');
        industryLabel.classList.add("web-app-emotion-cache-1tp0q7s");
        industryLabel.classList.add("css-v72tci");
        industryLabel.id = "industryLabel";
        industryLabel.innerHTML = "Industry Average";
        industryCircle.appendChild(industryLabel);

        // Right Side of Body
        const rightDiv = document.createElement('div');
        rightDiv.classList.add("css-omg4g8");
        bodyDiv.appendChild(rightDiv);

        // Environment
        const env = document.createElement('div');
        env.classList.add("css-pr360d");
        rightDiv.appendChild(env);

        const envLabel = document.createElement('span');
        envLabel.classList.add("css-1xb4h71");
        envLabel.classList.add("label")
        envLabel.innerHTML = "Environmental Risk";
        env.appendChild(envLabel);

        const envScale = document.createElement('div');
        envScale.classList.add("css-qwhg9q");
        envScale.classList.add("scale");
        env.appendChild(envScale);

        const envBar = document.createElement('div');
        envBar.classList.add("css-xkmqxn");
        envBar.classList.add("bar");
        envScale.appendChild(envBar);

        const envValBox = document.createElement('div');
        envValBox.classList.add("css-e7a241");
        // Calculate what percentage of the max envScore is, and adjust its position accordingly
        const envPercent = ((envScore / 21) * 100);
        envValBox.style.left = envPercent.toString() + "%";
        envScale.appendChild(envValBox);

        const envVal = document.createElement('span');
        envVal.classList.add("web-app-emotion-cache-1tp0q7s");
        envVal.classList.add("css-1i37pvb");
        envVal.classList.add("value");
        envVal.innerHTML = envScore;
        envValBox.appendChild(envVal);

        // Social
        const soc = document.createElement('div');
        soc.classList.add("css-pr360d");
        rightDiv.appendChild(soc);

        const socLabel = document.createElement('span');
        socLabel.classList.add("css-1xb4h71");
        socLabel.classList.add("label")
        socLabel.innerHTML = "Societal Risk";
        soc.appendChild(socLabel);

        const socScale = document.createElement('div');
        socScale.classList.add("css-qwhg9q");
        socScale.classList.add("scale");
        soc.appendChild(socScale);

        const socBar = document.createElement('div');
        socBar.classList.add("css-xkmqxn");
        socBar.classList.add("bar");
        socScale.appendChild(socBar);

        const socValBox = document.createElement('div');
        socValBox.classList.add("css-e7a241");
        // Calculate what percentage of the max envScore is, and adjust its position accordingly
        const socPercent = ((socScore / 21) * 100);
        socValBox.style.left = socPercent.toString() + "%";
        socScale.appendChild(socValBox);

        const socVal = document.createElement('span');
        socVal.classList.add("web-app-emotion-cache-1tp0q7s");
        socVal.classList.add("css-1i37pvb");
        socVal.classList.add("value");
        socVal.innerHTML = socScore;
        socValBox.appendChild(socVal);

        // Governances
        const gov = document.createElement('div');
        gov.classList.add("css-pr360d");
        rightDiv.appendChild(gov);

        const govLabel = document.createElement('span');
        govLabel.classList.add("css-1xb4h71");
        govLabel.classList.add("label")
        govLabel.innerHTML = "Governmental Risk";
        gov.appendChild(govLabel);

        const govScale = document.createElement('div');
        govScale.classList.add("css-qwhg9q");
        govScale.classList.add("scale");
        gov.appendChild(govScale);

        const govBar = document.createElement('div');
        govBar.classList.add("css-xkmqxn");
        govBar.classList.add("bar");
        govScale.appendChild(govBar);

        const govValBox = document.createElement('div');
        govValBox.classList.add("css-e7a241");
        // Calculate what percentage of the max envScore is, and adjust its position accordingly
        const govPercent = ((govScore / 15.5) * 100);
        govValBox.style.left = govPercent.toString() + "%";
        govScale.appendChild(govValBox);

        const govVal = document.createElement('span');
        govVal.classList.add("web-app-emotion-cache-1tp0q7s");
        govVal.classList.add("css-1i37pvb");
        govVal.classList.add("value");
        govVal.innerHTML = govScore;
        govValBox.appendChild(govVal);

        // Text Section
        const textSection = document.createElement('div');
        textSection.classList.add("css-zjik");
        textSection.classList.add("text-section");
        rightDiv.appendChild(textSection);

        // Review Section
        const reviewBox = document.createElement('div');
        reviewBox.classList.add("css-laj9r3");
        reviewBox.id = "reviewBox";
        textSection.appendChild(reviewBox);

        const review = document.createElement('div');
        review.classList.add("css-1uqh1gj");
        reviewBox.appendChild(review);

        const reviewHeader = document.createElement('h3');
        reviewHeader.classList.add("css-v72tci");
        reviewHeader.innerHTML = "In the News";
        review.appendChild(reviewHeader);

        const reviewBody = document.createElement('span');
        reviewBody.classList.add("web-app-emotion-cache-0");
        reviewBody.innerHTML = summary;
        review.appendChild(reviewBody);

        // Ranking Section
        const rankingBox = document.createElement('div');
        rankingBox.classList.add("css-gosvcs");
        rankingBox.id = "rankingBox";
        textSection.appendChild(rankingBox);

        const ranking = document.createElement('div');
        ranking.classList.add("css-1uqh1gj");
        rankingBox.appendChild(ranking);

        const rankingHeader = document.createElement('h3');
        rankingHeader.classList.add("css-v72tci");
        rankingHeader.innerHTML = "Top ESG Companies Within " + sector;
        ranking.appendChild(rankingHeader);
        
        const rankingList = document.createElement('ol');
        rankingList.classList.add("web-app-emotion-cache-0");
        ranking.appendChild(rankingList);

        const rankOne = document.createElement('li');
        rankOne.innerHTML = topCompanies[0];
        rankingList.appendChild(rankOne);

        const rankTwo = document.createElement('li');
        rankTwo.innerHTML = topCompanies[1];
        rankingList.appendChild(rankTwo);

        const rankThree = document.createElement('li');
        rankThree.innerHTML = topCompanies[2];
        rankingList.appendChild(rankThree);

        const rankFour = document.createElement('li');
        rankFour.innerHTML = topCompanies[3];
        rankingList.appendChild(rankFour);

        const rankFive = document.createElement('li');
        rankFive.innerHTML = topCompanies[4];
        rankingList.appendChild(rankFive);


        prevSection.parentNode.insertBefore(newSection, prevSection);

        console.log('Found element:', element);
    } catch (error) {
        console.error('Error:', error.message);
}
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', modifyElementContent);
    } else {
    modifyElementContent();
}