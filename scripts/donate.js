(function(window) {
  var stripe = Stripe('pk_test_KYRURBgo7mqY51cJWF8cpQTH')
  var elements = stripe.elements()
  var $form = document.querySelector('#donate-form-container')
  var $formMsg = document.querySelector('#donate-form-msg')

  var style = {
    base: {
      fontSize: '16px',
      lineHeight: '48px'
    }
  }

  var card = elements.create('card', style)
  card.mount('#donate-form')

  card.addEventListener('change', function(ev) {
    if (ev.error) {
      $formMsg.textContent = ev.error.message
    } else {
      $formMsg.textContent = ''
    }
  })

  $form.addEventListener('submit', function(ev) {
    ev.preventDefault()
    stripe.createToken(card).then(function(result) {
      console.log('result', result)
      if (result.error) {
        // Inform the user if there was an error
        $formMsg.textContent = result.error.message
      } else {
        // Send the token to your server
        stripeTokenHandler(result.token)
      }
    })
  })

  function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  $form.appendChild(hiddenInput);

  // Submit the form
  $form.submit();
}
})(window)
