const request = require("supertest");
const app = require("../app")

describe("POST /user", () => {
    describe("인증되지 않은 이메일 로그인 요청", () => {
        test("상태코드 409반환, user 등록 불가", async () => {
            const response = await request(app).post("/users").send({
                email: "addUser@test.com",
                wallet_address: "TestAddUserWalletAddr"
            })
            expect(response.statusCode).toBe(409);
        })
    })
})
