import YFVue from './YFVue/index'
const myVue: any = new YFVue({
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
//myVue.$mount()

myVue._data.a = new Date().toString()
console.log(myVue)

// setInterval(() => {
//     myVue._data.a = new Date().toString()
//     console.log(myVue)
// }, 5000)