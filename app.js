var express= require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");

//App config
mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema=new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type:Date, default: Date.now}
});

// Mongoose Model Config
var Blog=mongoose.model("Blog", blogSchema);

/*
Blog.create({
	title:"Test Blog",
	image: "https://images.unsplash.com/photo-1552845775-a7a50f21deb0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
	body: "HELLO THIS IS A BLOG POST"
})
*/

//Restful routes

//Index route
app.get("/",function(req,res){
	res.redirect("/blogs");
});


app.get("/blogs",function(req,res){
	Blog.find({}, function(err, blogs){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("index", {blogs: blogs});
		}
	});
	
});

//New Route
app.get("/blogs/new", function(req,res){
	res.render("new");
});
//Create route
app.post("/blogs", function(req,res){
	//create blog
	//redirect
	//console.log(req.body);
	req.body.blog.body=req.sanitize(req.body.blog.body);
	//console.log(req.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}
		else
		{
			res.redirect("/blogs");
		}
	})
});


//SHow Route

app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			//console.log(req);
			res.render("show",{blog: foundBlog});
		}
	});
});

//Edit Route
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			res.render("edit",{blog: foundBlog});		
		}
	})
	
});

//Update Route
app.put("/blogs/:id", function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
		if(err)
		{
			res.redirect("/blogs/");
		}
		else
		{
			res.redirect("/blogs/" + req.params.id);
		}

	});
});

//delete route
app.delete("/blogs/:id", function(req,res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			res.redirect("/blogs");
		}
	});
});


app.listen(3000, function(){
	console.log("SERVER IS RUNNING");
});