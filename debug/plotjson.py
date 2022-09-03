import matplotlib.pyplot as plt
import sys
import json

with open(sys.argv[1], "r") as f:
    data = json.load(f)

print(f"data length: {len(data)}")
print(f"cycles: {len(data)/2048}")

values = list(data.values())

for i in range(int(len(values)/2048)):
    plt.plot(values[2048*i:2048*(i+1)])

plt.show()
