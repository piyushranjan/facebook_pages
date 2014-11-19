var PageOps = {
  init: function(){
    console.log("initing");
    $("form").submit(function(e){
      createPagePost($("textarea").val());
      $("textarea").val("");
      e.preventDefault();
      return false;
    });
  },
  composeTableRow: function(obj){
    var str="";
    if(obj.type == "status")          
      str = str+"<tr><td>" + obj.message + "</td><td>" + (obj.is_published ? "Published" : "Not published") + "</td><td>" + obj.created_time + "</td><td>" + obj.privacy.value + "</td><td>" + obj.type + "</td></tr>";
    else if(obj.type == "link")
      str = str+"<tr><td><img src='" + obj.picture + "'><br/>" + obj.caption + "</td><td>" + (obj.is_published ? "Published" : "Not published") + "</td><td>" + obj.created_time + "</td><td>" + obj.privacy.value + "</td><td>" + obj.type + "</td></tr>";
    else if(obj.type == "photo")
      str = str+"<tr><td><img src='" + obj.picture + "'></td><td>" + (obj.is_published ? "Published" : "Not published") + "</td><td>" + obj.created_time + "</td><td>" + obj.privacy.value + "</td><td>" + obj.type + "</td></tr>";
    return str;
  }, 
  showPageInfo: function(response){
    if(!response || response.error)
      return;
    var str = "<h1>" +  response.name + "</h1>";
    str += "<h3>" + response.about + "<h3>";
    str += "<h4>Likes: " + response.likes + "<h4>";
    str += "<h4>Talking about: " + response.talking_about_count + "<h4>";
    $("#status").html(str);
  }
}
