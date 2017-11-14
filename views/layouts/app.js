// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    //$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    $("#articles").append("<li class ='list-group-item' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</li>");
    
  }
});

//whenever someone clicks a li tage
$(document).on("click","li",function(){

    // Empty the notes from the note section
    $("#notes").empty();

    //Save the id from the p tage
    var thisId = $(this).attr("data-id");

    //make an ajax call
     $.get("/articles/"+thisId, function(data, status){

      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#notes").append("<button data-id='" + data._id + "' id='delete'>Delete Note</button>");

      // If there's a note in the article
        if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
})



// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  $.post("/articles/"+thisId, 
    {title:$("#titleinput").val(),body:$("#bodyinput").val()})
  .done(function(data){
    console.log("Data Loaded: " +data);
     //removes note from html page
     $("#notes").empty();
     
  })
 
 //once the button is pressed you want to clear out the notes modal
 $("#titleinput").val("");
 $("#bodyinput").val("");

 })

// When you click the savenote button
$(document).on("click", "#delete", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a DELETE request to change the note, using what's entered in the inputs
  $.ajax({
    url: "/articles/" + thisId,
    type: "DELETE",
   
  }).done(function(data){

      console.log("done");
      $("#notes").empty();
    
  })
   
});




