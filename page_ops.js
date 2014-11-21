var PageOps = {
  init: function(fb_api){
    $("form").submit(function(e){
      fb_api.createPagePost($("textarea").val(), $("select[name='published']").val(), function(response){
        $("textarea").val("");        
      }, function(e){
        $("#status").html(e);
      });
      e.preventDefault();
      return false;
    });

    $(document).on("click", "table#feed a", function(e){
      var a = $(e.currentTarget);
      if(confirm("do you really want to delete this post ?")){
        var obj_id = a.parent().parent()[0].id;
        fb_api.deletePagePost(obj_id, function(){
          PageOps.deleteRow(obj_id);
        });        
      }
      //e.preventDefault()
    });
  },
  composeTableRow: function(obj){
    var str="";
    str = str+"<tr id='" + obj.id + "'><td>" 
    if(obj.type == "status")          
      str+= obj.message + "</td><td>"
    else if(obj.type == "link")
      str += "<img src='" + obj.picture + "'><br/>" + obj.caption + "</td><td>"
    else if(obj.type == "photo")
      str += "<img src='" + obj.picture + "'></td><td>";
    str+= (obj.is_published ? "Published" : "Not published") + "</td><td>" + obj.created_time + "</td><td>"
    str+= obj.privacy.value + "</td><td>" + obj.type + "</td><td class='stat'>" + (obj.post_views ? obj.post_views : "0") + "</td><td><a href='#'>[x]</a></td></tr>";
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
    $("table#feed tr#" + obj_id + " td.stat").html(views_count);
  },
  deleteRow: function(obj_id){
    $("table#feed tr#" + obj_id).remove();
  }

}
