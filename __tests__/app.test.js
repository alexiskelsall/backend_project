const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../db/app");
const connection = require("../db/connection")
const testData = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed");
const { fetchArticles } = require("../db/Models/get.models");
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
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            votes: expect.any(Number), 
            comment_count: expect.any(Number), 
          })
        })
      });
      });
    test("200: Responds with the correct comment count for articles",()=>{
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body:{articles}}) => {
        expect(articles[0].comment_count).toBe(2)
        expect(articles[3].comment_count).toBe(0)
        expect(articles[5].comment_count).toBe(2)
    })  
  })
  test("200: Should be able to sort by a valid column name in ascending order",()=>{
    return request(app)
      .get("/api/articles?&sort_by=author&order=asc")
      .expect(200)
      .then(({body})=>{
        expect(body.articles).toBeSorted({key: "author", ascending: true})
      })
  })
  test("200: Should be able to sort by a valid column name in descending order",()=>{
    return request(app)
      .get("/api/articles?&sort_by=title&order=desc")
      .expect(200)
      .then(({body})=>{
        expect(body.articles).toBeSorted({key: "title", descending: true})
      })
  })
  test("200: Should be able to filter by topic",()=>{
    return request(app)
    .get("/api/articles?topic=mitch&sort_by=title&order=desc")
    .expect(200)
    .then(({body})=>{
      expect(body.articles).toHaveLength(12)
    })
  })
  test("200: Should be able to filter by topic",()=>{
    return request(app)
    .get("/api/articles?topic=mitch&sort_by=title&order=desc")
    .expect(200)
    .then(({body})=>{
      expect(body.articles).toHaveLength(12)
    })
  })
  test("400: Invalid topic query", ()=>{
    return request(app)
      .get("/api/articles?topic=code&sort_by=title&order=desc")
      .expect(400)
      .then((res)=>{
        expect(res.body.error).toBe("Bad Request")
      })
  })
  test("400: Invalid sort_by query", ()=>{
    return request(app)
      .get("/api/articles?&sort_by=name")
      .expect(400)
      .then((res)=>{
        expect(res.body.error).toBe("Bad Request")
      })
  })
  test("400: Invalid order query", ()=>{
    return request(app)
      .get("/api/articles?&sort_by=author&order=toptobottom")
      .expect(400)
      .then((res)=>{
        expect(res.body.error).toBe("Bad Request")
      })
  })

describe.skip("GET /api/articles/:article_id", () => {
  test.only("200: Responds with the correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({body}) => {
       const article = body.article
       console.log(article)
        expect(article).toEqual( [{
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        
          
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

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with a posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "lurker", body: "I really enjoyed this book" })
      .expect(201)
      .then(({ body: { newComment } }) => {
          expect(newComment[0].author).toBe("lurker")
          expect(newComment[0].article_id).toBe(1)
          expect(newComment[0].body).toBe("I really enjoyed this book")
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
  test("400: Username and body values are not strings",()=>{
    return request(app)
    .post("/api/articles/2/comments")
    .send({ username: 31516, body: 1234 })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Bad Request");
    });
  })
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({body}) => {
        const updatedArticle = body.article
        expect(updatedArticle).toHaveProperty("title"); 
        expect(updatedArticle).toHaveProperty("topic"); 
        expect(updatedArticle).toHaveProperty("author"); 
        expect(updatedArticle).toHaveProperty("body"); 
        expect(updatedArticle).toHaveProperty("article_id"); 
        expect(updatedArticle).toHaveProperty("article_img_url"); 

        expect(updatedArticle.votes).toBe(5)
      });
  });
  test("200: Works with negative numbers", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: -4})
      .then(({ body}) => {
        const updatedArticle = body.article
        expect(updatedArticle.votes).toBe(-4)
      });
  });
  test("404: Responds with a 404 message if ID not found", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 5 })
      .expect(404)
      .then((res) => {
       expect(res.body.error).toBe("Not Found")
      });
  });
  test("400: ID not a number", () => {
    return request(app)
      .patch("/api/articles/coding")
      .expect(400)
      .then((res) => {
       expect(res.body.error).toBe("Bad Request") 
      });
  });
  test("400: Responds with a 400 if inc_votes is not an interger", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 4.5 })
      .expect(400)
      .then((res) => {
        expect(res.body.error).toBe("Bad Request");
      });
  
});
test("400: Responds with a 400 if inc_votes is not a number", () => {
  return request(app)
    .patch("/api/articles/2")
    .send({ inc_votes: "hello" })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Bad Request");
    });
});
test("400: Responds with a 400 if nothing is sent", () => {
  return request(app)
    .patch("/api/articles/2")
    .send({ })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Bad Request");
    });
});
});

describe("DELETE /api/comments/:comment_id",()=>{
  test("204: Responds with a 204 and no content",()=>{
    return request(app)
    .delete("/api/comments/2")
    .expect(204)
    .then(()=>{
      return connection.query(`
        SELECT * FROM comments`)
    })
    .then(({rows})=>{
      rows.forEach((comment)=>{
        expect(comment.comment_id).not.toBe(2)
      })
    })

  })
  test("404: Responds with a 404 message if comment_id is not found",()=>{
    return request(app)
    .delete("/api/comments/9999")
    .expect(404)
    .then((res)=>{
      expect(res.body.error).toBe("Not Found")
    })
   })
  test("400: ID not a number",()=>{
    return request(app)
    .delete("/api/comments/notanumber")
    .expect(400)
    .then((res)=>{
      expect(res.body.error).toBe("Bad Request")
    })
   })
})

describe("GET /api/users", () => {
  test("200: Responds with 'username', 'name', 'avatar_url'as properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({body:{users}}) => {
          users.forEach((user)=>{
          expect(user).toHaveProperty("username")
          expect(user).toHaveProperty("name")
          expect(user).toHaveProperty("avatar_url")
        })
      });
  });
});

