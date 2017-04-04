(function(window) {
  var stripe = Stripe('pk_test_KYRURBgo7mqY51cJWF8cpQTH')
  var elements = stripe.elements()
  var $form = document.querySelector('#donate-form-container')
  var $formMsg = document.querySelector('#donate-form-msg')

  var opts = {
    classes: {
      base: 'input'
    },
    style: {
      color: 'white',
      fontFamily: '"PitchLight", monospace',
      fontSize: '1.3rem'
    }
  }

  var card = elements.create('card', opts)
  card.mount('#stripe-target')

  card.addEventListener('change', function(ev) {
    if (ev.error) {
      showError(ev.error.message)
    } else {
      clearMsg()
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

  function clearMsg() {
    $formMsg.textContent = ''
  }

  function showError(msg) {
    $formMsg.textContent = msg

    console.error(msg)
  }

  function showSuccess(msg) {
    $form.querySelector('#donate-form').style.display = 'none'
    $form.querySelector('input[type="submit"]').disabled = true
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
