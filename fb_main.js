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
    document.getElementById('status').innerHTML = 'Please log into this app.';
  } else {
    document.getElementById('status').innerHTML = 'Please log into Facebook.';
  }
}

function getPageInfo() {
  FB.api('/'+ page_id, "get", {"access_token": page_access_token}, function(response) {
    if(!response.error){
      PageOps.showPageInfo(response);
    }
  });
}

function createPagePost(message){
  console.log(message, page_id);
  FB.api("/" + page_id + "/feed", "POST", {"message": message, "access_token": page_access_token}, function(response){
    if(response && !response.error){
      console.log(response);
      getPageFeed();
    }
  })
}


function getPageFeed() {
  $('#feed').html("");

  FB.api('/'+ page_id + '/promotable_posts', "get", {"access_token": page_access_token}, function(response) {
    if(!response.error && response.data){
      var str = "";
      for(var i = 0; i < response.data.length; i++){
        var obj = response.data[i];
        str += PageOps.composeTableRow(obj);

        FB.api("/" + obj.id + "/insights/post_consumptions", "get", {"access_token": page_access_token}, function(analytics_response){
          console.log(analytics_response);
        })
      }
      $('#feed').html(str);
    }
  });

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


