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
        return `hello ${this.a}`
    }
})
console.log('---mount---')
myVue.$mount('#app')

myVue._data.a = new Date().toString()
console.log(myVue)

setInterval(() => {
    myVue.a = new Date().toString()
}, 1000)