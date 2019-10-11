
$.getJSON("/articles", function(data) {
   
    for (var i = 0; i < data.length; i++) {
   
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });


  $("#scrape").on("click", function (event) {
    event.preventDefault();
    $.get("/scrape", function (data) {
        location.reload();
    });
  });
  
  
  
  $("#savedArticle").on("click", function (event) {
    event.preventDefault();
    let id = $(this).children().val();
    let data = {
        _id: id
    }
    $.ajax("/update/" + id, {
        type: "PUT",
        data: data
    })
    location.reload();
  });
  
  
  
  $("#delete-article").on("click", function (event) {
    event.preventDefault();
    let id = $(this).children().val();
    let data = {
        _id: id
    }
    $.ajax("/delete/" + id, {
        type: "PUT",
        data: data
    })
    location.reload();
  });