import YFVue from './YFVue/index'

console.log(YFVue)
const myVue = new YFVue({
    data: function () {
        return {
            a: {
                b: 1
            },
        }
    },
    render() {
        console.log('render', this)
        return `hello ${this.data.a.b}`
    }
})
console.log('---mount---')
myVue.$mount()

setInterval(() => {
    myVue.data.a = new Date().toString()
    console.log(myVue)
}, 5000)