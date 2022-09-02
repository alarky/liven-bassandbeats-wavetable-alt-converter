from scipy.io.wavfile import read, write
import numpy as np
import matplotlib.pyplot as plt

wav = "data/Analog_BD_Sin.wav"
fs, data = read(wav)

plt.plot(data)
plt.show()