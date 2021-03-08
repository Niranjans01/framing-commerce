import { TERMS_AND_CONDITIONS_CHECKOUT_STATUS_CHANGED } from '../actions/checkoutAction'

const initState = []

const checkoutReducer = (state = initState, action) => {
  if (action.type === TERMS_AND_CONDITIONS_CHECKOUT_STATUS_CHANGED) {
    return [{ checked: !action.payload.status }]
  }
}