import iconImgSrc from '@/assets/img/head/logo1.png'
import searchImgSrc from '@/assets/img/head/search.png'
import cartImgSrc from '@/assets/img/head/cart.png'
import personImgSrc from '@/assets/img/head/person.png'

export const app = {
  state: () => ({
    pageHeaderBackground: "transparent",
    iconImgSrc,
    color: "#fff",
    searchImgSrc,
    cartImgSrc,
    personImgSrc,
    isLogin: false,
  }),
  mutations: {
    SET_PAGE_HEADER_BACKGROUND(state, background) {
      state.pageHeaderBackground = background;
    },
    SET_ICON_IMG_SRC(state, src) {
      state.iconImgSrc = src;
    },
    SET_COLOR(state, color) {
      state.color = color;
    },
    SET_SEARCH_IMG_SRC(state, src) {
      state.searchImgSrc = src;
    },
    SET_CART_IMG_SRC(state, src) {
      state.cartImgSrc = src;
    },
    SET_PERSON_IMG_SRC(state, src) {
      state.personImgSrc = src;
    },
    SET_IS_LOGIN(state, isLogin) {
      state.isLogin = isLogin;
    },
  },
  actions: {
    setPageHeaderBackground({ commit }, background) {
      commit("SET_PAGE_HEADER_BACKGROUND", background);
    },
    setIconImgSrc({ commit }, src) {
      commit("SET_ICON_IMG_SRC", src);
    },
    setColor({ commit }, color) {
      commit("SET_COLOR", color);
    },
    setSearchImgSrc({ commit }, src) {
      commit("SET_SEARCH_IMG_SRC", src);
    },
    setCartImgSrc({ commit }, src) {
      commit("SET_CART_IMG_SRC", src);
    },
    setPersonImgSrc({ commit }, src) {
      commit("SET_PERSON_IMG_SRC", src);
    },
    setIsLogin({ commit }, isLogin) {
      commit("SET_IS_LOGIN", isLogin);
    },
  },
  getters: {
    pageHeaderBackground: (state) => state.pageHeaderBackground,
    iconImgSrc: (state) => state.iconImgSrc,
    color: (state) => state.color,
    searchImgSrc: (state) => state.searchImgSrc,
    cartImgSrc: (state) => state.cartImgSrc,
    personImgSrc: (state) => state.personImgSrc,
    isLogin: (state) => state.isLogin,
  },
};
