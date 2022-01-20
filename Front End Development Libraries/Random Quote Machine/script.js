let quoteData;

const settings = {
  "async": false,
  "url": "https://type.fit/api/quotes",
  "method": "GET" };


$.ajax(settings).done(function (response) {
  quoteData = JSON.parse(response);
});

function getQuote() {
  const i = Math.floor(Math.random() * quoteData.length);
  const quote = quoteData[i];
  $("#text").html('"' + quote.text + '"');
  $("#author").html(quote.author);
  createTweetLink(quote.text);
}

function createTweetLink(text) {
  const link = "https://twitter.com/intent/tweet?text=";
  $("#tweet-quote").attr("href", link + encodeURIComponent(text));
}

getQuote();

$("#new-quote").click(getQuote);
$(document).keydown(function (e) {
  if (e.code == "Space") getQuote();
});