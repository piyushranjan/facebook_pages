//var page_id = "136240350531";
var page_id = "383445028486028";
var page_access_token = "";

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    var userId = response.authResponse.userID;
    FB.api("/"+userId + "/accounts", function(r){
      for(var i=0; i<r.data.length; i++){
        if(r.data[i].id == page_id){
          page_access_token = r.data[i].access_token;
          break;
        }
      }
    })
    statusChangeCallback(response);
  });
}


function statusChangeCallback(response) {
  if (response.status === 'connected') {
    getPageInfo();
    getPageFeed();
    PageOps.init();
  } else if (response.status === 'not_authorized') {
    $('#status').html('Please log into this app.');
  } else {
    $('#status').html('Please log into Facebook.');
  }
}

function getPageInfo() {
  FB.api('/'+ page_id, "get", {"access_token": page_access_token}, function(response) {
    if(!response.error){
      PageOps.showPageInfo(response);
    }
  });
}

function createPagePost(message, is_published, callback, error_callback){
  FB.api("/" + page_id + "/feed", "POST", {"message": message, "access_token": page_access_token, "published": is_published}, function(response){
    if(response && !response.error){
      FB.api("/" + response.id, "get", {"access_token": page_access_token}, function(new_post){
        // hack to find if the post is published
        new_post.is_published = is_published === "false" ? false: true;
        var str = PageOps.composeTableRow(new_post);
        $('#feed tr:first').after(str);
      });
      callback(response);
    }else{
      error_callback(response.error);
    }
  })
}


function getPageFeed() {
  FB.api('/'+ page_id + '/promotable_posts', "get", {"access_token": page_access_token}, function(response) {
    if(!response.error && response.data){
      var str = "";
      for(var i = 0; i < response.data.length; i++){
        var obj = response.data[i];
        str += PageOps.composeTableRow(obj);
        (function(obj_id){
          FB.api("/" + obj.id + "/insights/post_impressions", "get", {"access_token": page_access_token}, function(analytics_response){
            PageOps.addViewsToPost(obj_id, analytics_response.data[0].values[0].value);
          });
        })(obj.id);
      }
      $('#feed tr:first').after(str);
    }
  });

}

function deletePagePost(post_id, callback){
  console.log(post_id);
  FB.api(
    "/" + post_id,
    "DELETE",
    {"access_token": page_access_token},
    function (response) {
      console.log(response);
      if (response && !response.error) {
        if(callback)
          callback();
      }
    }
);
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '501161540026250',
    xfbml      : true,
    version    : 'v2.2'
  });

  checkLoginState();
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));


