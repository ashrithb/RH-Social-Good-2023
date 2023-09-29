import csv
import json
from collections import defaultdict

data = []
sectors = defaultdict(list)
keys = ['Symbol', 'Name', 'Address', 'Sector', 'Industry', 'Full Time Employees', 'Description', 'Total ESG Risk score', 'Environment Risk Score', 'Governance Risk Score', 'Social Risk Score', 'Controversy Level', 'Controversy Score', 'ESG Risk Percentile', 'ESG Risk Level']

with open("./SP 500 ESG Risk Ratings.csv","r") as csvfile:
    reader = csv.reader(csvfile)
    c = -1
    for row in reader:
        c += 1
        if not c: continue
        obj = dict(zip(keys,row))
        
        if obj['Sector'] and obj['Total ESG Risk score']:
            t = (int(obj['Total ESG Risk score']), obj['Symbol'])
            sectors[obj['Sector']].append(t)

        data.append(obj)
  
    
for sector in sectors.keys():
    sectors[sector].sort(key=lambda x: x[0])

averageBySector = defaultdict(int)

for sector, vals in sectors.items():
    t = sum([x[0] for x in vals])
    averageBySector[sector] = t / len(vals)


f = open("./data.json", "w")
f.write(json.dumps(
    {"keys": keys, "averageBySector": averageBySector, "sectors": sectors, "data": data}
))
f.close()
