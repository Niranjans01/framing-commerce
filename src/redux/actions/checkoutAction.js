export const TERMS_AND_CONDITIONS_CHECKOUT_STATUS_CHANGED = 'TERMS_AND_CONDITIONS_CHECKOUT_STATUS_CHANGED'

export const termsAndConditions = (
  checked
) => {
  return dispatch => {
    dispatch({
      type: TERMS_AND_CONDITIONS_CHECKOUT_STATUS_CHANGED,
      payload: {
        status: checked
      }
    })
  }
}