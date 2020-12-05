import { IVNode } from "./interface/index"

export class VNode implements IVNode {
    tag?: string
    data?: any
    children?: Array<IVNode>
    text?: string
    elm: Element
 
    constructor(tag?: string, data?: any, children?: Array<IVNode>, text?: string) {
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
    }
}