import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  const ticket = Ticket.build({
    title: "Rock in Rio",
    price: 850,
    userId: "123",
  });

  await ticket.save();

  const t1 = await Ticket.findById(ticket.id);
  const t2 = await Ticket.findById(ticket.id);

  t1!.set("price", 10);
  t2!.set("price", 15);

  await t1!.save();

  let r: Error | undefined;
  try {
    await t2!.save();
  } catch (err) {
    r = err as Error;
  }

  expect(r!.message).toMatch(
    /No matching document found for id \"(.*)\" version 0 modifiedPaths \"price\"/
  );
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "Rock in Rio",
    price: 850,
    userId: "123",
  });

  await ticket.save();

  expect(ticket.version).toBe(0);
  ticket.set("price", 1000);
  await ticket.save();
  expect(ticket.version).toBe(1);
  ticket.set("price", 1500);
  await ticket.save();
  expect(ticket.version).toBe(2);
});
