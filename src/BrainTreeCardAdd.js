import React, { Component } from 'react'
import approve from 'approvejs'
// import { connect } from 'react-redux'
import {
  client as braintreeClient,
  hostedFields as brainTreehostedFields
} from 'braintree-web'
import jquery from 'jquery/src/jquery'
import './scss/creditcardAdd.scss';

let creditCardformValid = false

export default class CreditCard extends Component {
  constructor (props) {
    super(props)
    this.handleNameChange = this.handleNameChange.bind(this);
    this.cardStyle = {
      input: {
        color: '#282c37',
        'font-size': '16px',
        transition: 'color 0.1s',
        'line-height': '3'
      },
      // Style the text of an invalid input
      'input.invalid': {
        color: '#E53A40'
      },
      // placeholder styles need to be individually adjusted
      '::-webkit-input-placeholder': {
        color: '#868e96'
      },
      ':-moz-placeholder': {
        color: '#868e96'
      },
      '::-moz-placeholder': {
        color: '#868e96'
      },
      ':-ms-input-placeholder': {
        color: '#868e96'
      }
    }
    this.state = {
      cardholderName: '',
      nameErrors: [],
      cardholderNameFocused: false
    }
  }

  componentDidMount () {
    const form = document.querySelector('#my-sample-form')
    const submit = document.querySelector('input[type="submit"]')
    const { nonceToken, cardStyle } = this.props
    this.props.setLoader(true)
    const styles = cardStyle ? cardStyle : this.cardStyle
    if (nonceToken) {
      const setLoadComplete = () => this.props.setLoader(false)
      const saveCreditCardDetails = data => this.props.saveCreditCardDetails(data)
      braintreeClient.create(
        {
          authorization: nonceToken
        },
        function (err, clientInstance) {
          if (err) {
            console.error(err)
            return
          }
          // Create input fields and add text styles
          brainTreehostedFields.create(
            {
              client: clientInstance,
              styles: styles,
              // Add information for individual fields
              fields: {
                number: {
                  selector: '#card-number',
                  placeholder: '1111 1111 1111 1111'
                },
                cvv: {
                  selector: '#cvv',
                  placeholder: '123'
                },
                expirationDate: {
                  selector: '#expiration-date',
                  placeholder: '10 / 2019'
                }
              }
            },
            function (err, hostedFieldsInstance) {
              if (err) {
                console.error(err)
                setLoadComplete()
                return
              }
              setLoadComplete()

              hostedFieldsInstance.on('validityChange', function (event) {
                // Check if all fields are valid, then show submit button
                const formValid = Object.keys(event.fields).every(function (
                  key
                ) {
                  return event.fields[key].isValid
                })
                creditCardformValid = formValid
                const cardholderName = jquery('#cardholder-name')[0].value
                const result = approve.value(cardholderName, {
                  title: 'cardholderName',
                  required: true,
                  format: {
                    regex: /^[A-Za-z/ ]+$/,
                    message: 'Name can only have alphabets and spaces.'
                  }
                })
                if (formValid && result.errors.length <= 0) {
                  // document.querySelector('#my-sample-form')
                  jquery('#button-pay').addClass('show-button')
                } else {
                  jquery('#button-pay').removeClass('show-button')
                }
              })

              hostedFieldsInstance.on('empty', function (event) {
                jquery('header').removeClass('header-slide')
                jquery('#card-image').removeClass()
                jquery(form).removeClass()
                if (
                  jquery('#modal-content').hasClass('model-content-background')
                ) {
                  jquery('#modal-content').removeClass(
                    'model-content-background'
                  )
                }
              })

              hostedFieldsInstance.on('cardTypeChange', function (event) {
                // Change card bg depending on card type
                if (event.cards.length === 1) {
                  jquery(form)
                    .removeClass()
                    .addClass(event.cards[0].type)
                  jquery('#card-image')
                    .removeClass()
                    .addClass(event.cards[0].type)
                  jquery('header').addClass('header-slide')
                  jquery('#cardholder-name')
                    .removeClass()
                    .addClass(event.cards[0].type)
                  if (
                    !jquery('#modal-content').hasClass(
                      'model-content-background'
                    )
                  ) {
                    jquery('#modal-content').addClass(
                      'model-content-background'
                    )
                  }
                  // Change the CVV length for AmericanExpress cards
                  if (event.cards[0].code.size === 4) {
                    hostedFieldsInstance.setAttribute({
                      field: 'cvv',
                      attribute: 'placeholder',
                      value: '1234'
                    })
                  }
                } else {
                  hostedFieldsInstance.setAttribute({
                    field: 'cvv',
                    attribute: 'placeholder',
                    value: '123'
                  })
                }
              })

              submit.addEventListener(
                'click',
                function (event) {
                  event.preventDefault()
                  const cardholderName = jquery('#cardholder-name')[0].value
                  const primary = jquery('#primary')[0].checked
                  hostedFieldsInstance.tokenize(
                    {
                      cardholderName: cardholderName,
                      primary: primary
                    },
                    function (err, payload) {
                      if (err) {
                        console.error(err)
                        return
                      }
                      // This is where you would submit payload.nonce to your server
                      // alert('Submit your nonce to your server here!');
                      saveCreditCardDetails({
                        nonceToken: payload.nonce,
                        cardholderName,
                        primary
                      })
                    }
                  )
                },
                false
              )
            }
          )
        }
      )
    }
  }

  handleNameChange ({ currentTarget: { name, value } }) {
    value = value.replace(/[^a-zA-Z\ ]/g, '')
    const { errors } = approve.value(value, {
      title: 'cardholderName',
      required: true,
      format: {
        regex: /^[A-Za-z/ ]+$/,
        message: 'Name can only have alphabets and spaces.'
      }
    })
    if (errors.length <= 0 && creditCardformValid) {
      // document.querySelector('#my-sample-form')
      jquery('#button-pay').addClass('show-button')
    } else {
      jquery('#button-pay').removeClass('show-button')
    }
    this.setState({
      cardholderName: value,
      nameErrors: errors
    })
  }

  render () {
    const { cardholderName, nameErrors, cardholderNameFocused } = this.state
    const { loadingBraintree, containerClassName } = this.props
    return (
      <div className={containerClassName ? containerClassName : ''}>
        <div className="creditCardAdd form-control">
          <div className="form-container">
            <form
              action="/"
              id="my-sample-form"
              className="scale-down"
              autoComplete="off"
              method="post">
              <div className="cardinfo-card-number">
                <label className="cardinfo-label" htmlFor="card-number">
                  Card Number
              </label>
                <div className="input-wrapper" id="card-number" />
                <div id="card-image" />
              </div>
              <div className="cardinfo-card-holder-number">
                <label className="cardinfo-label" htmlFor="card-holder-number">
                  Card Holder Name
              </label>
                <div
                  className={`input-wrapper ${nameErrors &&
                    nameErrors.length > 0 &&
                    'braintree-hosted-fields-invalid'} ${
                    cardholderNameFocused ? 'braintree-hosted-fields-focused' : ''
                    }`}
                  id="card-holder-number"
                  onFocus={() => this.setState({ cardholderNameFocused: true })}
                  onBlur={() => this.setState({ cardholderNameFocused: false })}>
                  <input
                    style={{
                      border: 'none',
                      width: '100%',
                      backgroundColor: 'transparent',
                      fontSize: '16px'
                    }}
                    className="cardholder-name"
                    id="cardholder-name"
                    name="cardholderName"
                    onChange={this.handleNameChange}
                    value={cardholderName}
                    placeholder={loadingBraintree ? '' : 'Cardholder Name'}
                  />
                </div>
                <div id="card-image" />
              </div>
              <div className="cardinfo-wrapper">
                <div className="cardinfo-exp-date">
                  <label className="cardinfo-label" htmlFor="expiration-date">
                    Valid Thru
                </label>
                  <div className="input-wrapper" id="expiration-date" />
                </div>
                <div className="cardinfo-cvv">
                  <label className="cardinfo-label" htmlFor="cvv">
                    CVV
                </label>
                  <div className="input-wrapper" id="cvv" />
                </div>
              </div>
              <div className="mt-3 d-flex align-items-center form-group">
                <input type="checkbox" id="primary" className="styled-checkbox" />
                <label className="mb-0 ml-2" htmlFor="primary">
                  Use as primary card
              </label>
              </div>
            </form>
            <input id="button-pay" type="submit" value="Continue" />
          </div>
        </div>
      </div>
    )
  }
}
