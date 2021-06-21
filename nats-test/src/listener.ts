import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("LISTENER CONNECTED TO NATS");

  stan.on("close", () => {
    console.log("NATS CONNECTION CLOSED");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();

  // const opts = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()             // deliver all messages
  //   .setDurableName('subscription-name'); // not processed by this durable name (id) - needs queue group

  // const subscription = stan.subscribe(
  //   "ticket:created",
  //   "queue-group-name",
  //   opts
  // );

  // subscription.on("message", (msg: Message) => {
  //   const data = msg.getData();

  //   if (typeof data === "string")
  //     console.log("Message received", msg.getSequence(), JSON.parse(data));

  //   msg.ack();
  // });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());