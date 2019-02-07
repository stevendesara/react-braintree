import React, { Component } from 'react'

import Form from './utils/Form'
import InputGroup1 from './utils/InputGroup'
// import Select from 'react-select'


export default class CreditCard extends Component {
  render () {
    const {
      isEdit,
      expiryMonth,
      expiryMonths,
      expiryYear,
      years,
      mode,
      expirationError,
      cvv,
      primary,
      formCvv,
      fields,
      handleChange,
      onModeChange,
      handleSelectChange,
      onPrimaryClick,
      closeModal,
      handlePayment,
      Select
    } = this.props;
    return (
      <div>
        <div className="row m-0 creditCard">
          {!isEdit && (
            <div className="col-sm-6 mt-4 pl-4">
              <label className="custom-control custom-radio float-left">
                <input
                  type="radio"
                  name="creditCard"
                  className="custom-control-input"
                  value="isCreditCard"
                  onChange={onModeChange}
                  checked={mode === 'creditCard'}
                />
                <span className="custom-control-indicator" />
                <span className="custom-control-description ml-2">
                  Credit card
                </span>
              </label>
            </div>
          )}
          <div className="col-sm-12 mt-2 pl-4 d-flex">
            {/* {isEdit ? (
              <img
                src={creditCardImages[cardType.toLowerCase()]}
                alt=""
                className="mr-2"
              />
            ) : (
                <div>
                  <img src={visa} alt="" className="mr-2" />
                  <img src={mastercard} alt="" className="mr-2" />
                  <img src={americanexpress} alt="" className="mr-2" />
                </div>
              )} */}
          </div>
          <div className="row m-0">
            <Form className="payment-form text-left" autoComplete="off">
              <div className="text-left">
                Name (As it appears on your card)
              </div>
              <InputGroup1
                field={fields[0]}
                onChange={handleChange}
                addtClassName="mt-3"
                disabled={mode === 'writeTransfer'}
              />
              <div style={{ marginTop: '30px' }} className="text-left">
                Card Number (No dashes or spaces)
              </div>
              <InputGroup1
                field={fields[1]}
                onChange={handleChange}
                addtClassName="mt-3"
                isEditable={false}
                isEdit={isEdit}
                disabled={mode === 'writeTransfer'}
              />
              <div style={{ marginTop: '30px' }} className="text-left">
                Expiry Date
              </div>
              <div className="input-wrapper mt-3 text-left">
                <div className="row">
                  <div className="col-4">
                    <Select
                      autosize
                      // placeholder={"select-default-language"}
                      autofocus
                      options={expiryMonths}
                      simpleValue
                      searchable={false}
                      name="expiryMonth"
                      value={expiryMonth}
                      onChange={value =>
                        handleSelectChange('expiryMonth', value)
                      }
                      isDisabled={mode === 'writeTransfer'}
                    />
                  </div>
                  <div className="col-4">
                    <Select
                      searchable={false}
                      autosize
                      // placeholder={"select-default-language"}
                      autofocus
                      options={years}
                      simpleValue
                      name="expiryYear"
                      value={expiryYear}
                      onChange={value =>
                        handleSelectChange('expiryYear', value)
                      }
                      isDisabled={mode === 'writeTransfer'}
                    />
                  </div>
                </div>
                {expirationError.length > 0 &&
                  expirationError.map((error, i) => (
                    <div key={i} className="form-text text-danger">
                      {error}
                    </div>
                  ))}
              </div>
              {!isEdit && (
                <div>
                  <div
                    style={{ marginTop: '30px' }}
                    className="mt-3 text-left">
                    Security Code (3 on the back, Amex: on the front)
                  </div>
                  <div className="col-12 d-flex p-0 mt-3">
                    <div className="input-wrapper text-left col-4 pl-0">
                      <input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        onChange={handleChange}
                        required
                        className="cvv-field"
                        value={formCvv}
                        disabled={mode === 'writeTransfer'}
                      />
                    </div>
                    {/* <div className="input-wrapper text-left">
                      <img
                        src={creditCardCvvBack}
                        alt=""
                        className="cvv-card-icon"
                      />
                    </div>
                    <div className="input-wrapper text-left">
                      <img
                        src={creditCardCvvFront}
                        alt=""
                        className="cvv-card-icon"
                      />
                    </div> */}
                  </div>
                  {cvv &&
                    cvv.errors.map((error, i) => (
                      <div key={i} className="form-text text-danger">
                        {error}
                      </div>
                    ))}
                </div>
              )}
              <div className="mt-3 d-flex align-items-center form-group">
                <input
                  type="checkbox"
                  id="isPrimary"
                  className="styled-checkbox"
                  checked={primary}
                  onClick={onPrimaryClick}
                />
                <label className="mb-0 ml-2" for="isPrimary">
                  Use as primary card
                </label>
              </div>
            </Form>
          </div>
        </div>
        <div className="button-wrapper">
          <button
            className="btn btn-primary btn-outline btn-custom-underline text-uppercase remove"
            onClick={closeModal}>
            Back
        </button>
          <button
            className="btn btn-primary btn-default-size text-uppercase"
            type="submit"
            onClick={handlePayment}>
            {isEdit ? 'Edit' : 'Add'}
          </button>
        </div>
      </div>
    )
  }
}

