import sys
import json
import matplotlib.pyplot as plt

with open(sys.argv[1], "r") as f:
    data = json.load(f)

values = list(data.values())
values = [v - 256 if v >= 128 else v for v in values]

plt.plot(values[:1024])
plt.show()