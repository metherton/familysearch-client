/**
 * This file contains code to setup the SDK client and detect whether the user is logged in.
 */

// Setup the SDK client
var client = new FamilySearch({
  
  // A client ID for sandbox is obtained by registering with the FamilySearch developer's website
  client_id: 'a02j0000008gOCiAAM',
  
  // When using the the popup method of authentication, the redirect uri doesn't need to be a
  // page that actually exists, it just needs to be a page on the same domain.
  // But in our case we have an example that uses the full redirect method so
  // we set the redirect_uri to the page that handle the redirect response.
  // Here we programmatically set the redirect uri to the base path of the
  // current domain. That helps the sample app work wherever it runs so
  // that we don't have to change this between development and production.
  redirect_uri: document.location.protocol + '//' + document.location.host + '/examples/authentication-redirect-end',
  
  // Store the access token in a cookie so that the user doesn't have to
  // login every time the page loads
  save_access_token: true,
  
  // Sandbox is the testing environment
  environment: 'sandbox'
});

// In this next section we are populating the username in the header.
// First we check if the username is stored in a cookie. If we are logged in
// (have an access token) but don't have a username then we request the 
// current user from the API and save the username in a cookie.
var promise;
if(cookiesUtil.getItem('username')){
  promise = Promise.resolve(cookiesUtil.getItem('username'));
} else if(client.hasAccessToken()){
  promise = client.getCurrentUser().then(function(response){
    var username = response.getUser().getContactName();
    // Expire cookie after 24 hours (86400 seconds)
    cookiesUtil.setItem('username', username, 86400);
    return username;
  });
} 

// Here we know that the user is not logged in. Show a warning on all example
// pages telling the user that they need to login for the example to work.
else {
  if(document.location.pathname.indexOf('/examples/') === 0 && document.location.pathname.indexOf('authentication') === -1){
    $('<div>')
      .addClass('alert alert-warning')
      .html('You need to sign in first for the examples to work. Sign in with the <a href="/examples/authentication">FamilySearch Authentication</a> example.')
      .appendTo('#main');
  }
}

// If we have a username then add it to the header
if(promise){
  promise.then(function(username){
    $('#username').text(username);
    $('#signOut').click(signOut).show();
  });
}

function signOut(){
  client.invalidateAccessToken();
  cookiesUtil.removeItem('username');
  document.location.reload();
}