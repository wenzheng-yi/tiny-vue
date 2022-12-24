import { h } from '../../lib/tiny-vue.esm.js'
export const Foo = {
  setup(props){
    console.log('Foo的props', props)
    props.count++
  },
  render(){
    return h('div', {}, 'Foo:' + this.count)
  }
}