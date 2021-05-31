import request from "supertest";
import { app } from "../../app";

it("fails with unexisting email", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "unexisting@email.com",
      password: "password",
    })
    .expect(400);
});

it("fails with wrong password", async () => {
  const r = await request(app)
    .post("/api/users/signup")
    .send({
      email: "netera@gmail.com",
      password: "3214",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "netera@gmail.com",
      password: "password",
    })
    .expect(400);
});

it("sucessfull signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "netera@gmail.com",
      password: "3214",
    })
    .expect(201);

  const r = await request(app)
    .post("/api/users/signin")
    .send({
      email: "netera@gmail.com",
      password: "3214",
    })
    .expect(200);

  expect(r.get("Set-Cookie")).toBeDefined();
});
