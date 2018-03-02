'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// REVIEW: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// COMMENT: Why isn't this method written as an arrow function?
// Because it is a protoype and uses contextual this as a result.  Arrow functions cannot be used where there is contextual this being used.
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // COMMENT: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // We are showing the date each article was published on and calling that value from our article object using jQuery.  We include the text 'published....days ago'. 
  // The ? is called a ternary, which is a conditional (ternary) operator.  It is an operator that takes three operands. It is frequently used as a shortcut for the if statement.  the : is short for 'or' so ? : =  if or.  We've seen this before when using an if/else statement.
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENT: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// the loadAll function is being called at the end of our article.js file. rawData represents a method that we can call later.  In previous labs, rawData represented a parameter and represented our articles.
Article.loadAll = rawData => {
  rawData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  rawData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

// REVIEW: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEW: What is this 'if' statement checking for? Where was the rawData set to local storage?    
  // COMMENT This 'if' statement is checking to see if there is any rawData/articles in our localStorage. We are looking at the rawData in our localStorage, parsing the data into a JSON object so we can then use that data in our client via loading all the raw data into each instantiated Article.  If there is no rawData available, we use the .get AJAX method to stringify the rawData object and place that into our localStorage.rawData for the next time the page is loaded so it can then be retrieved and displayed from the application.   
  if (localStorage.rawData) {
    Article.loadAll(JSON.parse(localStorage.rawData));
    articleView.initIndexPage();
  } else {
    $.getJSON('data/hackerIpsum.json')
      .then(rawData => {
        Article.loadAll(rawData)
        localStorage.rawData = JSON.stringify(rawData);
        articleView.initIndexPage();
      })
  }
}
