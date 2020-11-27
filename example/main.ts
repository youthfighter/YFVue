import YFVue from '../src/index'

let vm = new YFVue({
    data() {
        return {
            abc: '123'
        }
    }
})

console.log(vm)