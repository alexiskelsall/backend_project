const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../db/app");
const connection = require("../db/connection")
const testData = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")


beforeEach(()=> {return seed(testData)}) 

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

describe("404", ()=>{
  test('should respond with 404 and a message of "Endpoint not found"',()=>{
    return request(app)
    .get("/api/incorrectpath")
    .expect(404)
    .then((res)=>{
      expect(res.body.message).toBe("Endpoint not found")
    })
  })
})

describe.only("GET /api/articles/:article_id", () => {
  test.only("200: Responds with the correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({body}) => {
       const article = body.article
        expect(article).toEqual( [{
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }])
        
      });
  });

  test("404: Responds with a 404 message of 'Not Found", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((res) => {
       expect(res.body.error).toBe("Not Found")
        
      });
  });

  test("400: ID not a number", () => {
    return request(app)
      .get("/api/articles/coding")
      .expect(400)
      .then((res) => {
       expect(res.body.error).toBe("Bad Request")
        
      });
  });
});

