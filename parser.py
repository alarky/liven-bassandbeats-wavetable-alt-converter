import sys
import json
import matplotlib.pyplot as plt

with open(sys.argv[1], "r") as f:
    data = json.load(f)

values = list(data.values())

plt.plot(values[:2048])
plt.show()