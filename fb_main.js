//var page_id = "136240350531";
var page_id = "383445028486028";
var app_id  = "501161540026250";

function checkLoginState(){
  var fb_api = FbApiWrapper;
  fb_api.checkLoginState(function(response){
    if (response.status === 'connected') {
      fb_api.getPageInfo(function(response){
        PageOps.showPageInfo(response);
      });

      // fill table
      fb_api.getPageFeed(function(obj_arr){
        for(var i = 0; i < obj_arr.length; i++){
          var obj = obj_arr[i];
          var str = PageOps.composeTableRow(obj);
          $('#feed tr:last').after(str);
          //PageOps.addViewsToPost(obj.id, obj.post_views);
        }
      });

      // add event listeners
      PageOps.init(fb_api);

    } else if (response.status === 'not_authorized') {
      $('#status').html('Please log into this app.');
    } else {
      $('#status').html('Please log into Facebook.');
    }

  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : app_id,
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


