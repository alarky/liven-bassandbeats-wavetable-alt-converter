from scipy.io.wavfile import read, write
import numpy as np
import sys
import matplotlib.pyplot as plt

wav = sys.argv[1]
fs, data = read(wav)

size = 2048
for i in range(128):
    plt.plot(data[2048*i:2048*(i+1)])
plt.show()