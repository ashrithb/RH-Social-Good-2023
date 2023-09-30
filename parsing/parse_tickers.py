import csv
import json
from collections import defaultdict


tickers = {}

with open("./tickers.csv","r") as csvfile:
    reader = csv.reader(csvfile)
    c = -1
    for row in reader:
        c += 1
        if not c: continue
        ticker, name = row[0], row[1]
        if ticker not in tickers:
            tickers[ticker] = name

f = open("./tickers.json", "w")
f.write(json.dumps(tickers))
f.close()