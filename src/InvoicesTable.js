import React from 'react'
import { DateTimePicker } from 'react-widgets'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import { IF } from './utils/nullchecker'

import './scss/invoicesTable.scss';

moment.locale('en')
momentLocalizer()

const getColorName = status => {
  if (status === 'SUCCESS') {
    return 'text-success'
  } else if (status === 'FAILURE') {
    return 'text-danger'
  }
  return 'text-warning'
}

const RenderStatus = ({ status, parent, invoiceId, onSelect }) => {
  if (parent === 'users-invoices') {
    if (status === 'BLOCKED' || status === 'UNPAID') {
      return (
        <a
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            onSelect({ invoiceId, status })
          }}>
          <u>{IF(status) && status.toLowerCase()}</u>
        </a>
      )
    }
  } else if (parent === 'logged-in-user-invoices') {
    if (status === 'BLOCKED') {
      return (
        <span>
          {IF(status) && status.toLowerCase()} <br />
          <button
            type="button"
            className="btn btn-primary text-uppercase btn-sm pay-now-btn"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              onSelect({ invoiceId, status })
            }}>
            Pay now
          </button>
        </span>
      )
    }
  }
  return <span>{IF(status) && status.toLowerCase()}</span>
}

const InvoicesTable = ({
  invoices = [],
  isLoading,
  onDateChange,
  selectedStartDate,
  selectedEndDate,
  minStartDate,
  containerClassName,
  parent,
  onSelect,
  isRemarkEnabled
}) => {
  return (
    <div className={containerClassName ? containerClassName : ''}>
      <div className="invoices m-0">
        <div className="d-flex justify-content-end mb-3">
          <div className="pl-2 pr-0 date-filter d-flex">
            From
          <DateTimePicker
              min={new Date(minStartDate)}
              max={new Date(selectedEndDate)}
              onChange={date => onDateChange('selectedStartDate', date)}
              views={['year', 'decade']}
              time={false}
              format="MM/YYYY"
              value={new Date(selectedStartDate)}
              inputProps={{ readOnly: true }}
            />
          </div>
          <div className="pr-2 pl-0 date-filter d-flex">
            To
          <DateTimePicker
              onChange={date =>
                onDateChange(
                  'selectedEndDate',
                  new Date(moment(date).endOf('month'))
                )
              }
              value={selectedEndDate}
              views={['year', 'decade']}
              time={false}
              format="MM/YYYY"
              min={new Date(moment(selectedStartDate).add(1, 'months'))}
              inputProps={{ readOnly: true }}
            />
          </div>
        </div>
        <div
          className="container">
          <table className="table table-fixed">
            <thead>
              <tr>
                {/* <th className="col-2">Date</th> */}
                <th className={isRemarkEnabled ? 'col-2' : 'col-3'}>
                  Invoice Number
              </th>
                <th className="col-2 text-right">Invoice Amount</th>
                <th className="col-2">From Date</th>
                <th className="col-2">To Date</th>
                <th className={isRemarkEnabled ? 'col-1' : 'col-2'}>Status</th>
                {isRemarkEnabled && <th className="col-2">Remarks</th>}
                <th className="col-1 text-center">
                  <i className="fa fa-download" aria-hidden="true" />
                </th>
              </tr>
            </thead>
            <tbody className="table table-hover">
              {!isLoading &&
                invoices.map &&
                invoices.map(
                  ({
                    dateTime = '',
                    pathToaccessDoc = '',
                    amount = '',
                    invoiceId = '',
                    status = '',
                    fromDate = '',
                    toDate = '',
                    remarks = ''
                  }) => (
                      <tr key={invoiceId}>
                        {/* <td className="col-2">{dateTime}</td> */}
                        <td className={isRemarkEnabled ? 'col-2' : 'col-3'}>
                          {invoiceId}
                        </td>
                        <td className="col-2 text-right">
                          <b>{amount}</b>
                        </td>
                        <td className="col-2">{fromDate}</td>
                        <td className="col-2">{toDate}</td>
                        <td
                          className={`${
                            isRemarkEnabled ? 'col-1' : 'col-2'
                            } text-capitalize text-center ${getColorName(status)}`}>
                          <RenderStatus
                            status={status}
                            parent={parent}
                            invoiceId={invoiceId}
                            onSelect={onSelect}
                          />
                        </td>
                        {isRemarkEnabled && <td className="col-2">{remarks}</td>}
                        <td className="col-1 text-center">
                          <a href={pathToaccessDoc} target="_blank">
                            <i
                              className="fa fa-file-pdf-o text-danger"
                              aria-hidden="true"
                            />
                          </a>
                        </td>
                      </tr>
                    )
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default InvoicesTable
