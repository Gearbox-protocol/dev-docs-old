# Monitoiring & anomaly detection

This concept was designed by inspiration from Andon and the five whys method ([https://en.wikipedia.org/wiki/Andon\_(manufacturing)](https://en.wikipedia.org/wiki/Andon\_\(manufacturing\)), [https://en.wikipedia.org/wiki/Five\_whys](https://en.wikipedia.org/wiki/Five\_whys))

The gearbox protocol has a virtual model which is written in Golang. It emulates the protocol and updates the internal state after each new transaction.

![gearbox anomaly detection](/images/tutorial/anomaly_detection.jpeg)

If it's found the difference between protocol state and model one, the bot sends a transaction to pause all contracts until the development team will understand the reason.
