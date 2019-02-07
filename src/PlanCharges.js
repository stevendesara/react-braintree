import React, { Component } from 'react'
import { IF } from './utils/nullchecker';
// import Select from 'react-select'; 

export default class PlanCharges extends Component {
  render () {
    const {
      selectedDiscountType,
      selectedChargeType,
      handleChargeTypeSelect,
      handleDiscountTypeSelect,
      handleSubmit,
      onChange,
      model,
      schema,
      isEdited,
      slabsError = {},
      Input,
      Form,
      FieldArray,
      chargeTypeList,
      discountTypeList,
      Prompt,
      containerClassName,
      Select
    } = this.props;
    return (
      <div className={containerClassName ? containerClassName : ''}>
        <Form
          className="content"
          schema={schema}
          onSubmit={data => {
            handleSubmit(data)
          }}
          onChange={onChange}
          value={model}>
          <div className="row my-3">
            <div className="col-md-6">
              <Input
                label="Plan name"
                placeholder="Enter your plan name"
                name="planName"
                disabled
              />
            </div>
          </div>
          <div className="row my-3">
            <div className="col-md-6">
              <label htmlFor="chargeType">Charge type</label>
              <Select
                value={selectedChargeType.value}
                onChange={handleChargeTypeSelect}
                options={chargeTypeList}
                id="chargeType"
                name="chargeType"
              />
            </div>
            <div className="col-md-6">
              <Input
                label="Per API charge ($)"
                placeholder="Enter your per API charge"
                name="perApiCharge"
              />
            </div>
          </div>
          <div className="row my-3">
            <div className="col-md-6">
              <Input
                label="Base charge ($)"
                placeholder="Enter your base charge"
                name="baseCharge"
              />
            </div>
            <div className="col-md-6">
              <Input
                label="Base API count"
                placeholder="Enter your base API count"
                name="baseApiCount"
              />
            </div>
          </div>
          {IF(model.slabs) &&
            model.slabs.length > 0 && (
              <div className="row my-3">
                <div className="col-md-12">
                  <label>Slabs</label>
                  <FieldArray name="slabs" events="blur">
                    {({ value, arrayHelpers }) => (
                      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                        {value &&
                          value.map((value, idx) => (
                            <li key={idx}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start'
                                }}>
                                <div className="mx-2">
                                  <Input
                                    placeholder="From"
                                    name={`slabs[${idx}].from`}
                                  />
                                  {slabsError[`slabs[${idx}]`] &&
                                    slabsError[`slabs[${idx}]`]['fromInRange'] &&
                                    slabsError[`slabs[${idx}]`][
                                    'fromInRange'
                                    ] && (
                                      <span className="validation-error">
                                        From overlaps with other slabs
                                      </span>
                                    )}
                                  {slabsError[`slabs[${idx}]`] &&
                                    slabsError[`slabs[${idx}]`]['toIsLesser'] &&
                                    slabsError[`slabs[${idx}]`]['toIsLesser'] && (
                                      <div>
                                        <span className="validation-error">
                                          To range cannot be lesser than from
                                        </span>
                                      </div>
                                    )}
                                </div>
                                <div className="mx-2">
                                  <Input
                                    placeholder="To"
                                    name={`slabs[${idx}].to`}
                                    className="mx-2"
                                  />
                                  {slabsError[`slabs[${idx}]`] &&
                                    slabsError[`slabs[${idx}]`]['toInRange'] &&
                                    slabsError[`slabs[${idx}]`]['toInRange'] && (
                                      <span className="validation-error">
                                        To overlaps with other slabs
                                      </span>
                                    )}
                                </div>
                                <div className="mx-2 d-flex">
                                  <div className="d-flex align-items-center mx-2 h6 mb-0">
                                    $
                                  </div>
                                  <Input
                                    placeholder="Amount"
                                    name={`slabs[${idx}].charge`}
                                    className="mx-2"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    arrayHelpers.remove(value)
                                  }}>
                                  -
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    arrayHelpers.insert({ name: undefined }, idx)
                                  }}>
                                  +
                                </button>
                              </div>
                              <Form.Message for={`slabs[${idx}].name`} />
                            </li>
                          ))}
                      </ul>
                    )}
                  </FieldArray>
                </div>
              </div>
            )}
          <div className="row my-3">
            <div className="col-md-6">
              <label htmlFor="discountType">Discount type</label>
              <Select
                value={selectedDiscountType}
                onChange={handleDiscountTypeSelect}
                options={discountTypeList}
                id="discountType"
              />
            </div>
            <div className="col-md-6">
              <Input
                label={
                  selectedDiscountType.value === 'percentage'
                    ? 'Discount value (%)'
                    : 'Discount value ($)'
                }
                placeholder=""
                name="discountValue"
              />
            </div>
          </div>
          <div className="row my-3">
            <div className="col-md-6">
              <Input
                label="Updated by"
                placeholder=""
                name="updatedBy"
                disabled
              />
            </div>
            <div className="col-md-6">
              <Input
                label="Updated date"
                placeholder=""
                name="updatedDate"
                disabled
              />
            </div>
          </div>
          <div className="row my-3">
            <div className="col-md-6 d-flex align-items-center">
              <Form.Field
                label="Discount applicable"
                name="isDiscountEnabled"
                type="checkbox"
                id="isDiscountEnabled"
                checked={model.isDiscountEnabled}
              />
              <label className="mb-0 ml-3" htmlFor="isDiscountEnabled">
                Discount applicable
              </label>
            </div>
          </div>
          <div className="row my-3">
            <div className="col-auto ml-auto">
              <Form.Button
                className="btn btn-primary btn-bold btn-default-size profile-page__SubmitBtn"
                type="submit"
                disabled={!isEdited}>
                Save
              </Form.Button>
              <Prompt
                when={isEdited}
                message="Workspace charges information updated. Are you sure you want to leave without save?"
              />
            </div>
          </div>
        </Form>
      </div>
    )
  }
}
