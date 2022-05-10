import { h } from "../../lib/tiny-vue.esm.js";
window.self = null
export const App = {
  render() {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ["yellow", "green"],
      },
      'hi,' + this.msg
      // [
      //   h("p", { class: "yellow" }, "你好"),
      //   h("p", { class: "green" }, "tiny-vue")
      // ]
    )
  },

  setup() {
    return {
      msg: 'tiny-vue,ni hao'
    }
  }
}