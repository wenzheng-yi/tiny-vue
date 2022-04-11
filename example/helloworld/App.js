import { h } from "../../lib/tiny-vue.esm.js";
export const App = {
  render() {
    return h(
      'div',
      {
        id: 'root',
        class: ["yellow", "green"],
      },
      // 'hi,tiny-vue'
      [
        h("p", { class: "yellow" }, "你好"),
        h("p", { class: "green" }, "tiny-vue")
      ]
    )
  },

  setup() {
    return {
      msg: 'tiny-vue'
    }
  }
}