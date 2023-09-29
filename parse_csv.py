import csv
import json
from collections import defaultdict

tickers = defaultdict(list)
sectors = defaultdict(list)
keys = ['Symbol', 'Name', 'Address', 'Sector', 'Industry', 'Full Time Employees', 'Description', 'Total ESG Risk score', 'Environment Risk Score', 'Governance Risk Score', 'Social Risk Score', 'Controversy Level', 'Controversy Score', 'ESG Risk Percentile', 'ESG Risk Level']

with open("./SP 500 ESG Risk Ratings.csv","r") as csvfile:
    reader = csv.reader(csvfile)
    c = -1
    for row in reader:
        c += 1
        if not c: continue
        obj = dict(zip(keys,row))

        for key in ['Total ESG Risk score', 'Environment Risk Score', 'Governance Risk Score', 'Social Risk Score', 'Controversy Score']:
            if obj[key]:
                obj[key] = float(obj[key])
            else:
                obj[key] = -1
        
        if obj['Sector'] and obj['Total ESG Risk score']:
            t = (obj['Total ESG Risk score'], obj['Symbol'])
            sectors[obj['Sector']].append(t)

        tickers[obj['Symbol']] = obj

        for key in ['Symbol', 'Address','Industry', 'Full Time Employees', 'Description']:
            del obj[key]
  
    
for sector in sectors.keys():
    sectors[sector].sort(key=lambda x: x[0] + (1000 if x[0] == -1 else 0))

averageBySector = defaultdict(float)

for sector, vals in sectors.items():
    valid = [x[0] for x in vals if x[0] != -1]
    if valid:
        averageBySector[sector] = sum(valid) / len(valid)
    else: 
        averageBySector[sector] = -1
for k,v in tickers.items():
    print(k)
    print(v)
    print("\n\n")
f = open("./server/data.json", "w")
f.write(json.dumps(
    {"averageBySector": averageBySector, "sectors": sectors, "tickers": tickers}
))
f.close()
