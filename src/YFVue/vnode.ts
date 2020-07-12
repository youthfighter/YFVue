export default class VNode {
    tag: string
    data: any
    children: Array<VNode>

    constructor(tag, data, children) {
        this.tag = tag
        this.data = data
        this.children = children
    }
}