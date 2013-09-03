if (Meteor.is_client) {
  Template.hello.greeting = function () {
    return "Welcome to fiber-test.";
  };

  Template.hello.events = {
    'click input' : function () {
      var message = "You pressed the button and we ran an async job in a fiber just for fun!";

      Meteor.call('asyncJob', message, function(err, result) {
        if (typeof console !== 'undefined')
          console.log(message);
      });
    }
  };
}

if (Meteor.is_server) {

  Meteor.methods({
    asyncJob: function(message) {
      
      // Setup a future
      var fut = new Future();

      // This should work for any async method
      setTimeout(function() {

        // Return the results
        fut['return'](message + " (delayed for 3 seconds)");

      }, 3 * 1000);

      // Wait for async to finish before returning
      // the result
      return fut.wait();
    }
  });

}
