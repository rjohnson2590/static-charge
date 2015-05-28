var moment = require('moment');
moment().format();
var express = require('express');
var router = express.Router();
var fs = require('fs');
var marked = require('marked');

var postsDir = __dirname + '/../posts/';
var configfile = __dirname + '/../config.json'
var hierarchy = JSON.parse(fs.readFileSync(configfile,'utf-8'));

fs.readdir(postsDir, function(error, directoryContents) {
  if (error) {
    throw new Error(error);
  }
// var sort;
// var msArr=[];
function comparePostsByDate(post1,post2){
  return post2.realNum-post1.realNum
}

  var posts = directoryContents.map(function(filename) {
      var postName = filename.replace('.md', '');
      var contents = fs.readFileSync(postsDir + filename, {encoding: 'utf-8'})
      var firstSplit= contents.split("---")[1]
      var secondSplit= firstSplit.split('\n')[3]
      var thirdSplit= secondSplit.split(":")[1]
      var fourthSplit =moment(thirdSplit).format('x')
      // console.log(fourthSplit)
      // console.log(contents)
      // console.log(msArr)
      // sort = msArr.sort(compareNums)
      // console.log(sort)
      var dateNum= parseInt(fourthSplit)
      var titleSplit= firstSplit.split("title")[1]
      var actualTitle= titleSplit.split(":")[1]
      var seriousTitle= actualTitle.split(" ")[1]
      var thisTitle= seriousTitle.split('.')[0]
      console.log(thisTitle)
      return {postName: postName, contents: marked(contents), children : hierarchy["postz"] || [], date: fourthSplit, realNum:dateNum, realTitle:thisTitle};
  });
posts.sort(comparePostsByDate)
    for(var i=1; i<posts.length;i++){
      if(posts[i-1]){
      posts[i].prev= posts[i-1].postName
    }
  }
    for(var i=0; i<posts.length;i++){
     if(posts[i+1]){
      posts[i].nex=posts[i+1].postName
      } 
    }

 // GET home page
  router.get('/', function(request, response) {// produce a beahvior when the server recieves a get request
    response.render('index', {posts: posts, title: 'Blog'} )// renders the index.jade tempplate (passes information into it), the beahvior that is produced is pasing information to index.jade.
  });
  console.log(posts[1].prev)
  posts.forEach(function(post) {// creates a specific route for each post
    router.get('/' + post.postName, function(request, response) {
  response.render('post', {postContents: post.contents, postChildren: post.children, postPrev: post.prev, postNex:post.nex});

    });
  });
});

module.exports = router;
