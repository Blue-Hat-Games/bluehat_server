const request = require("supertest");
const app = require("../app")
const jwt_token = "";
const t_user_id = "";
const t_user_email = "";
const t_user_wallet_address = "";
describe("Users.Login API", () => {
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

describe("Users.EditUsername API", () => { })

describe("Users.getUserInfo API", () => { })

describe("Animal.getUserAnimal API", () => { })

describe("Animal.MakeNewAnimal API", () => { })

describe("Animal.MergeAnimal API", () => { })

describe("Auth.request API", () => { })

describe("Auth.verify API", () => { })

describe("Market.getAllMarketAnimal API", () => { })

describe("Market.sellAnimaltoMarket API", () => { })

describe("Market.MarketCount API", () => { })

describe("NFT.getNftAnimalById", () => { })
