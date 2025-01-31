# 📰 **Northcoders News API**  

**Live API:** [news-project-lza1.onrender.com](https://news-project-lza1.onrender.com)  

## 📌 **Project Overview**  
This backend project builds a **RESTful API** for programmatic data access. It uses **PostgreSQL** for data storage and `node-postgres` for database interactions.

## ⚙️ **Minimum Requirements**  
Ensure you have the following installed:  
- **Node.js**: v14.0.0 or higher  
- **PostgreSQL**: v12.0 or higher  

## 🚀 **Getting Started**  

### **1. Clone the Repository**  
```bash
git clone https://github.com/alexiskelsall/backend_project.git
cd backend_project
```

### **2. Install Dependencies**  
```bash
npm install
```

### **3. Configure Environment Variables**  
Since `.env.*` files are ignored in version control, manually create them:

1. Install `dotenv`:
   ```bash
   npm install dotenv
   ```
2. Create **`.env.development`** and **`.env.test`** files in the root directory. Each should contain:
   ```env
   PGDATABASE=nc_news
   ```

## 🛠 **Database Setup**  

### **1. Create Databases**  
Ensure PostgreSQL is running, then create the necessary databases:  

#### **Automatic Setup**  
```bash
npm run setup-dbs
```
### **2. Seed the Database**  
```bash
npm run seed
```

## ✅ **Testing**  
This project uses **Jest** for automated testing.  

### **1. Run Tests**  
```bash
npm test
```
To run a specific test file:  
```bash
npm test app.test.js
```

## 🔗 **API Endpoints**  

| **Method**  | **Route**                                    | **Description** |
|-------------|----------------------------------------------|-----------------|
| **GET**     | `/api`                                       | Returns all available API endpoints. |
| **GET**     | `/api/topics`                                | Retrieves an array of all topics. |
| **GET**     | `/api/users`                                 | Retrieves an array of all users. |
| **GET**     | `/api/users/:username`                       | Retrieves a specific user by `username`.|
| **GET**     | `/api/articles`                              | Retrieves an array of all articles. Supports sorting and filtering. |
| **GET**     | `/api/articles/:article_id`                  | Retrieves a specific article by `article_id`, including comment count. |
| **GET**     | `/api/articles/:article_id/comments`         | Retrieves all comments for a specific article. |
| **PATCH**   | `/api/articles/:article_id`                  | Updates an article's vote count. Requires `{ inc_votes: newVoteCount }`. |
| **POST**    | `/api/articles/:article_id/comments`         | Adds a comment to an article. Requires `{ username, body }`. |
| **DELETE**  | `/api/comments/:comment_id`                  | Deletes a comment by `comment_id`. |

## 🔍 **`GET/api/topics`**

## Response 

```
  {
    "description": "The man, the Mitch, the legend",
    "slug": "mitch"
  },
  {
    "description": "Not dogs",
    "slug": "cats"
  },
  {
    "description": "what books are made of",
    "slug": "paper"
  }
  ```

## 🔍 **`POST/api/:article_id/comments`**

## Request

```
   {
     "username": "Coder123",
      "body": "I really enjoyed this article!"
   }
```

## Response 

```
   {
      "comment_id": 102,
      "body": "I really enjoyed this article!",
      "article_id": 42,
      "author": "Coder123",
      "created_at": "2023-07-16T14:30:00.000Z",
      "votes": 0
   }
```
## **Notes**

- Use the `:article_id` and `:comment_id` placeholder with actual values when making requests.
- You can modify responses using query parameters for sorting and filtering where supported.



