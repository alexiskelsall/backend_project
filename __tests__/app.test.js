const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../db/app");
const connection = require("../db/connection")
/* Set up your test imports here */


// beforeEach(()=> {()}) 

afterAll(()=> {return connection.end()})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body:{topics}}) => {
          expect(Array.isArray(topics)).toBe(true)
        })
      });
  });
  test("200: Responds with 'slug and 'description' as properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body:{topics}}) => {
          topics.forEach((topic)=>{
          expect(topic).toHaveProperty("slug")
          expect(topic).toHaveProperty("description")
        })
      });
  });

describe.only("404", ()=>{
  test('should respond with 404 and a message of "Endpoint not found"',()=>{
    return request(app)
    .get("/api/incorrectpath")
    .expect(404)
    .then((res)=>{
      expect(res.body.error).toBe("Endpoint not found")
    })
  })
})