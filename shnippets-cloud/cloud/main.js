
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  var query = new Parse.Query(Parse.User);
  query.equalTo("email", request.object.get("email"));
  query.first({
    success: function(object) {
      if (object) {
        response.error("email " + request.object.get("email") + " already taken.");
      } else {
        response.success();
      }
    },
    error: function(error) {
      response.error("Could not validate uniqueness for this user.");
    }
  });
});
