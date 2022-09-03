import matplotlib.pyplot as plt
import scipy.io.wavfile
import sys

srate, data = scipy.io.wavfile.read(sys.argv[1])

print(f"sample rate: {srate}")
print(f"data length: {len(data)}")
print(f"cycles: {len(data)/2048}")

print(data[-100:])

for i in range(int(len(data)/2048)):
    plt.plot(data[2048*i:2048*(i+1)])

plt.show()
