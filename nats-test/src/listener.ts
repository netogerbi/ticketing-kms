import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("LISTENER CONNECTED TO NATS");

  const subscription = stan.subscribe(
    "ticket:created",
    "orders-services-queue-group"
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string")
      console.log("Message received", msg.getSequence(), JSON.parse(data));
  });
});
