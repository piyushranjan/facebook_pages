var PageOps = {
  init: function(){
    console.log("initing");
    $("form").submit(function(e){
      createPagePost($("textarea").val(), $("select[name='published']").val(), function(response){
        $("textarea").val("");        
        $()
      }, function(e){
        console.log(e);
        $("#status").html(e);
      });
      e.preventDefault();
      return false;
    });
  },
  composeTableRow: function(obj){
    console.log(obj);
    var str="";
    str = str+"<tr id='" + obj.id + "'><td>" 
    if(obj.type == "status")          
      str+= obj.message + "</td><td>"
    else if(obj.type == "link")
      str += "<img src='" + obj.picture + "'><br/>" + obj.caption + "</td><td>"
    else if(obj.type == "photo")
      str += "<img src='" + obj.picture + "'></td><td>";
    str+= (obj.is_published ? "Published" : "Not published") + "</td><td>" + obj.created_time + "</td><td>"
    str+= obj.privacy.value + "</td><td>" + obj.type + "</td><td></td></tr>";
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
  },
  addViewsToPost: function(obj_id, views_count){
    $("table#feed tr#" + obj_id + " td:last").html(views_count);
  }
}
