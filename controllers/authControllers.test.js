import request from "supertest";
import app from "../app.js";

describe("POST /api/auth/login", () => {
    beforeAll(async () => {
        await request(app)
            .post("/api/auth/register")
            .send({email: "user@example.com", password: "password123"})
            .expect((res) => {
                if (res.status !== 201 && res.status !== 409) {
                    throw new Error("Unexpected response status during registration");
                }
            });
    });

    it("should return status 200 and include a token", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({email: "user@example.com", password: "password123"})
            .expect(200);

        expect(res.body).toHaveProperty("token");
        expect(typeof res.body.token).toBe("string");
    });

    it("should return an object user with email and subscription fields", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({email: "user@example.com", password: "password123"})
            .expect(200);

        expect(res.body).toHaveProperty("user");
        expect(typeof res.body.user.email).toBe("string");
        expect(typeof res.body.user.subscription).toBe("string");
    });
});
