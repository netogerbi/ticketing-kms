import nats from "node-nats-streaming";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("PUB CONNECTED TO NATS");

  const data = JSON.stringify({
    id: "123",
    title: "Rock in Rio",
    price: 833.25,
  });

  stan.publish("ticket:created", data, () => {
    console.log("event published");
  });
});
