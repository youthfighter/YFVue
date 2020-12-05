import YFVue from '../src/index'

let vm = new YFVue({
    el: '#app',
    data() {
        return {
            abc: '123'
        }
    },
    render(h) {
        return h(undefined, undefined, undefined, this.abc)
    }
})

document.addEventListener('click', () => {
    vm.abc = new Date().toString()
})

console.log(vm)