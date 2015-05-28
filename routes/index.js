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
      var contents = fs.readFileSync(postsDir + filename, {encoding: 'utf-8'});
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
      var thisTitle= seriousTitle.split('<br />')[1]
      console.log(seriousTitle)
      return {postName: postName, contents: marked(contents), children : hierarchy["postz"] || [], date: fourthSplit, realNum:dateNum};
  });
posts.sort(comparePostsByDate)
    

 // GET home page
  router.get('/', function(request, response) {
    response.render('index', {posts: posts, title: 'all posts'} )
  });

  posts.forEach(function(post) {
    router.get('/' + post.postName, function(request, response) {
  response.render('post', {postContents: post.contents, postChildren: post.children});

    });
  });
});

module.exports = router;
