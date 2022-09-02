import mido
import matplotlib.pyplot as plt

messages = mido.read_syx_file("data/BDSI.syx")

dats = []
for dmsg in messages[1:-2]:
    dats.extend(dmsg.data[8:])

plt.plot(dats)
plt.show()