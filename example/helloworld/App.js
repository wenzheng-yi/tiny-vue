import { h } from "../../lib/tiny-vue.esm.js";
export const App = {
  render() {
    return h('div', 'hi,' + this.msg)
  },

  setup() {
    return {
      msg: 'tiny-vue'
    } 
  }
}