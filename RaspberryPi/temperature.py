# /sys/bus/w1/devices/28-041680822dff path for tem
import time
import pycurl
import logging
import time
import json
try:
	from urllib.parse import urlencode
except ImportError:
	from urllib import urlencode

if __name__ == '__main__':

    c = pycurl.Curl()
    c.setopt(c.URL, "https://icsuft.com/test/pulseServer.php")
    c.setopt(c.SSL_VERIFYHOST, 0)
    c.setopt(c.SSL_VERIFYPEER, 0)

    while 1:

		tfile = open("/sys/bus/w1/devices/28-041680822dff/w1_slave")
		text = tfile.read()

		#print text

		tfile.close()

		line2 = text.split("\n")[1]

		_temperature = line2.split(" ")[9]

		#print _temperature
		temperature = float(_temperature[2:])

		temperature = temperature / 1000

		print temperature

		post_data = {"temperature" : temperature}
		postfields = urlencode(post_data)
		c.setopt(c.POSTFIELDS, postfields)
		c.perform()

		time.sleep(1)


