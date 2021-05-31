import request from "supertest";
import { app } from "../../app";

jest.setTimeout(600000);
it("returns a 201 on sucessfull signup", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "netera@gmail.com",
      password: "3214",
    })
    .expect(201);
});

it("returns a 400 on invalid email", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "neteragmail.com",
      password: "3214",
    })
    .expect(400);
});

it("returns a 400 on invalid password", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "netera@gmail.com",
      password: "123",
    })
    .expect(400);
});

it("returns a 400 on missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "netera@gmail.com",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      password: "123",
    })
    .expect(400);
});

it("disallows duplicate e-mails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "netera@gmail.com",
      password: "123x",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "netera@gmail.com",
      password: "123y",
    })
    .expect(400);
});

it("expects a cookie after successfull signup", async () => {
  const r = await request(app)
    .post("/api/users/signup")
    .send({
      email: "netera@gmail.com",
      password: "3214",
    })
    .expect(201);

  expect(r.get("Set-Cookie")).toBeDefined();
});
