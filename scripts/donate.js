(function(window) {
  var stripe = Stripe('pk_test_KYRURBgo7mqY51cJWF8cpQTH')
  var elements = stripe.elements()
  var $form = document.querySelector('#donate-form-container')
  var $formMsg = document.querySelector('#donate-form-msg')

  var classes = {
    base: 'input'
  }
  var style = {
    base: {
      color: 'white',
      fontFamily: '"PitchLight", monospace',
      fontSize: '1.3rem'
    }
  }
  var opts = {
    classes: classes,
    style: style
  }

  var card = elements.create('card', opts)
  card.mount('#stripe-target')

  card.addEventListener('change', function(ev) {
    if (ev.error) {
      $formMsg.textContent = ev.error.message
    } else {
      $formMsg.textContent = ''
    }
  })

  $form.addEventListener('submit', function(ev) {
    var amount = $form.querySelector('#amount').value
    var email = $form.querySelector('#email').value
    var monthly = $form.querySelector('#monthly').checked

    ev.preventDefault()
    stripe.createToken(card).then(function(result) {
      console.log('result', result)
      if (result.error) {
        showError(result.error.message)
      } else {
        submit({
          amount: +amount,
          email: email,
          monthly: monthly,
          token: result.token.id
        })
      }
    })
  })

  function showError(msg) {
    $formMsg.textContent = msg

    console.error(msg)
  }

  function showSuccess(msg) {
    $form.querySelector('#donate-form').style.display = 'none'
    $form.querySelector('button').disabled = true
    $formMsg.textContent = msg || 'Thank you for your support'
  }

  function submit(body) {
    var api = 'https://operation45-donate.herokuapp.com/donate'
    var payload = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return fetch(api, payload).then(res => {
      if (res.status === 200) return showSuccess()
      throw new Error({ status: res.status, statusText: res.statusText })
    }).catch(err => {
      showError(err)
    })
  }

})(window)
