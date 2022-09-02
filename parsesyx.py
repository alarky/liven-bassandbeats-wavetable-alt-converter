import mido
import matplotlib.pyplot as plt

messages = mido.read_syx_file("data/01_Saw_Sine_Square_Triangle.syx")

dats = []
for dmsg in messages[1:-2]:
    data = dmsg.data[8:]
    for i in range(30):
        d8 = data[i*8:(i+1)*8]
        print(d8)

        signflgs = list(reversed([d8[0] >> i & 1 for i in range(7)]))

        sd8 = []
        for j in range(7):
            n = d8[j+1]
            if signflgs[j]:
                n -= 256
            sd8.append(n)

        dats.extend(sd8)
    #print(len(dmsg.data), dmsg.data[8:])

plt.plot(dats)
plt.show()