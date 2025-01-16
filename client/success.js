let urlParams = new URLSearchParams(window.location.search);
let sessionId = urlParams.get('session_id');
let orderDetails = "";

if (sessionId) {
  fetch('/checkout-session?sessionId=' + sessionId)
    .then(function (result) {
      console.log('Result');
      console.log(JSON.stringify(result));
      return result.json();
    })
    .then(function (session) {
      var sessionJSON = JSON.stringify(session, null, 2);
      console.log('Session');
      console.log(JSON.stringify(session));
      document.querySelector('span[id*="name"]').textContent = session.customer_details.name.split(' ')[0];;
      document.querySelector('span[id*="pickup-time"]').textContent = String(session.metadata.time).charAt(0) + ':' + String(session.metadata.time).substring(1, 3);

      session.metadata.cheese > 0 ? orderDetails += '<li>' + session.metadata.cheese + ' Cheese Pizza(s)</li>' : '';
      session.metadata.pepperoni > 0 ? orderDetails += '<li>' + session.metadata.pepperoni + ' Pepperoni Pizza(s)</li>' : '';
      session.metadata.special > 0 ? orderDetails += '<li>' + session.metadata.special + ' Special Pizza(s)</li>' : '';

      document.querySelector('ul[id*="order-details"]').innerHTML = orderDetails;
      //document.querySelector('pre').textContent = sessionJSON;
    })
    .catch(function (err) {
      console.log('Error when fetching Checkout session', err);
    });
}
