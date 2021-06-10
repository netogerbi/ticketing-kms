import request from "supertest";
import { app } from "../../app";

it("POST: /api/tickets", async () => {
  const r = await request(app).post("/api/tickets").send({});

  expect(r.status).not.toBe(404);
});

it("POST: /api/tickets - 401 should be authenticated", () => {});

it("POST: /api/tickets - 400 invalid title", () => {});

it("POST: /api/tickets - 400 invalid price", () => {});

it("POST: /api/tickets - 201 created", () => {});
