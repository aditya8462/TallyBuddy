const initialState = {
  cart: {},
  order: {},
};

export default function webContainer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      state.cart[action.payload[0]] = action.payload[1];
      return {
        // ...state,
        cart: state.cart,
        order: state.order,
      };

    case 'Delete_Cart_Items':
      delete state.cart[action.payload];
      return {
        // ...state,
        cart: state.cart,
        order: state.order,
      };

    case 'CLEAR_CART':
      state.cart = {};
      console.log('===========', state.cart);
      return {
        // ...state,
        cart: state.cart,
        order: state.order,
      };

    case 'Order':
      state.order[action.payload[0]] = action.payload[1];
      return {
        // ...state,
        order: state.order,
        cart: state.cart,
      };

    default:
      return state;
  }
}
