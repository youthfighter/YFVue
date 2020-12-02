import YFVue from '../src/index'

let vm = new YFVue({
    el: 'app',
    data() {
        return {
            abc: '123'
        }
    },
    render(h) {
        return h()
    },
})

console.log(vm)