var FbApiWrapper = (function(){
  var api = {}
  var page_access_token = "";    

  api.checkLoginState = function(callback) {
    FB.getLoginStatus(function(response) {
      var userId = response.authResponse.userID;

      FB.api("/"+userId + "/accounts", function(r){
        for(var i=0; i<r.data.length; i++){
          if(r.data[i].id == page_id){
            page_access_token = r.data[i].access_token;
            break;
          }
        }
      });

      if(callback)
        callback(response);
    });
  };

  api.getPageInfo = function(callback) {
    FB.api('/'+ page_id, "get", {"access_token": page_access_token}, function(response) {
      if(!response.error){
        callback(response);
      }
    });
  }

  api.createPagePost = function(message, is_published, scheduled_publish_time, callback, error_callback){
    var scheduled_timestamp;

    var api_params = {
      "message": message, "access_token": page_access_token, "published": is_published
    }

    if(!is_published && scheduled_publish_time && scheduled_publish_time.length > 0){
      try{
        scheduled_timestamp = (new Date(scheduled_publish_time)).getTime()/1000;
        api_params["scheduled_publish_time"] = scheduled_timestamp;
      }catch(e){
        error_callback("Scheduled date is wrong");
        return;
      }      
    }

    FB.api("/" + page_id + "/feed", 
      "POST", api_params, function(response){
      if(response && !response.error){
        FB.api("/" + response.id, "get", {"access_token": page_access_token}, function(new_post){
          // hack to find if the post is published
          new_post.is_published = is_published === "false" ? false: true;
          var str = PageOps.composeTableRow(new_post);
          $('#feed tr:first').after(str);
        });
        callback(response);
      }else{
        console.log(scheduled_timestamp);
        console.log(response.error);
        error_callback(response.error);
      }
    });
  }

  api.getPageFeed = function(callback) {
    FB.api('/'+ page_id + '/promotable_posts', "get", {"access_token": page_access_token}, function(response) {
      if(!response.error && response.data){

        var table_rows = response.data.length;
        var counter = 0;
        var arr = [];

        for(var i = 0; i < response.data.length; i++){
          var obj = response.data[i];
          arr[i] = obj;

          (function(obj_id, i){
            FB.api("/" + obj.id + "/insights/post_impressions", "get", {"access_token": page_access_token}, function(analytics_response){
              arr[i].post_views = analytics_response.data[0].values[0].value;
              counter++;

              if(counter==table_rows && callback)
                callback(arr);

            });
          })(obj.id, i);
        }

      }
    });
  }

  api.deletePagePost = function(post_id, callback){
    FB.api(
      "/" + post_id,
      "DELETE",
      {"access_token": page_access_token},
      function (response) {
        if (response && !response.error) {
          if(callback)
            callback();
        }
      });
  }
  return api;
})();
