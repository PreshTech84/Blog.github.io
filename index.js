import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.locals.isAuthenticated = isAuthenticated;
    next();

});


const blogPosts = [
{ id: 1, title: "The world of AI", comments: [] },
{ id: 2, title: "Online learning platforms for Web Dev", comments: [] },
{ id: 3, title: "Creating a CRUD", comments: [] },
{ id: 4, title: "Learning C#", comments: [] },

];

let isAuthenticated = false; 

app.get("/", (req, res) => {
    res.render ("../views/pages/home.ejs", { blogPosts, isAuthenticated, posts });

});

app.get("/pages/:id", (req, res) => {
    const postId = req.params.id;
    const post = blogPosts.find((post) => post.id == postId);

    if(post){
        res.render(`./pages/post${post.id}`, { post, isAuthenticated });
    } else{
        res.status(404).render("./pages/404.ejs");
    }
});

 app.get("/compose", (req, res) => {
    res.render("./pages/compose.ejs")
});

const posts = [];
let postTitle = [];
let postContent = [];

  app.post('/compose', (req, res) => {
    postTitle = req.body.postTitle
    postContent = req.body.postContent
  
    const postObj = {
      "title":postTitle,
      "content":postContent
    }
    
    posts.push(postObj)
    console.log(posts)
  });
  app.get('/posts/:postID', (req, res) => {
    let postTitle = req.params.postID
    let postContent = ''
    let title = ''
    
    posts.forEach((post) => {
      title = post.title
      content = post.content
    });
  
    if (_.toLower(postTitle) == _.toLower(title)) {
      res.render(
        'post', 
        {
          title,
          content
        })
    }
  });

app.post("/comment/:id", (req,res) => {
    const postId = req.params.id;
    const post = blogPosts.find((post) => post.id == postId);

    if(!isAuthenticated) {
        return res.redirect("/pages/404");
    }

    if(post) {
        const comment = req.body.comment;
        if(comment) {
            post.comments.push(comment);
        }
        return res.redirect(`/pages/${postId}`);
    } else {
        return res.redirect("/pages/404");
    }
});

app.get("/login", (req, res) => {
    res.render("./pages/login.ejs");
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if( username == 'Moffat' && password === '123456') {
        isAuthenticated = true;
        res.redirect("/");
    } else {
        res.render("/page/failure");
    }
});

app.get("/logout", (req, res) => {
    isAuthenticated = false;
    res.redirect("/");
});

/* app.get("/signup", (req, res) => {
    res.render("./pages/signup.ejs");
});

app.post("/signup", (req, res) => {
    const { username, password } = req.body;
    if( username == '' && password === '') {
        isAuthenticated = true;
        res.redirect("/");
    } else {
        res.render("/page/failure");
    }
}); */

/* app.post("/blogPosts", (req, res) => {
    const newPost = req.body;
    blogPosts.push(newItem);
    res.status(201).json(newPost);


}); */



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });