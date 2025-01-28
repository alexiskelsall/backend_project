const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../db/app");
const connection = require("../db/connection")
const testData = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")
require("jest-sorted")



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

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects in date descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body:{articles}}) => {
          expect(Array.isArray(articles)).toBe(true)
          expect(articles).toBeSortedBy("created_at", {descending: true})
          expect(articles).toHaveLength(13)
        })
      });
  test("200: Responds with the following properties: author,title, article_id, topic, created_at, votes, article_img_url, comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body:{articles}}) => {
        articles.forEach((article)=>{
           expect(article).not.toHaveProperty("body")
           expect(article).toHaveProperty("comment_count")
           expect(article).toHaveProperty("article_id")
           expect(article).toHaveProperty("title")
           expect(article).toHaveProperty("author")
           expect(article).toHaveProperty("created_at")
           expect(article).toHaveProperty("article_img_url")
           expect(article).toHaveProperty("topic")
           expect(article).toHaveProperty("votes")
           })
           });
      });
    test("200: Responds with the correct comment count for articles",()=>{
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body:{articles}}) => {
        expect(articles[0].comment_count).toBe("2")
        expect(articles[3].comment_count).toBe("0")
        expect(articles[5].comment_count).toBe("2")
    })  
  })

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the correct article", () => {
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
})

  test("404: Responds with a 404 message if ID not found", () => {
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
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("200: Responds with the most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("400: ID not a number", () => {
    return request(app)
      .get("/api/articles/invalid/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.error).toBe("Bad Request");
      });
  });
  test("404: Responds with a 404 message if ID not found", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.error).toBe("Not Found");
      });
  });
});

describe.only("POST /api/articles/:article_id/comments", () => {
  test.skip("201: Responds with a posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "lurker", body: "I really enjoyed this book" })
      .expect(201)
      .then(({ body: { newComment } }) => {
          expect(newComment[0].author).toBe("lurker")
          expect(newComment[0].article_id).toBe(1)
        newComment.forEach((comment) => { 
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("404: Responds with a 404 message if username is not found",()=>{
    return request(app)
    .post("/api/articles/2/comments")
    .send({ username: "Johnson", body: "Thought provokingly good" })
    .expect(404)
    .then((res) => {
      expect(res.body.error).toBe("Not Found");
    });
  })
  test.skip("400: Username and body values are not strings",()=>{
    return request(app)
    .post("/api/articles/2/comments")
    .send({ username: 31516, body: 1234 })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Bad Request");
    });
  })
});

