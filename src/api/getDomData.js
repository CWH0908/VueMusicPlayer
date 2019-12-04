 //从dom节点获取属性
 //el代表传入的节点，然后对name属性的值做拼接，拼接成的 data-name 形式的 ，我们在vue组件的don节点自定义的属性，第三个val参数可选
 export function getDomData(el, name, val) {
    const prefix ="data-";
    name = prefix +name;
    if(val){//有传入val值，则给自定义的属性赋值
        return el.setAttribute(name,val);
    }else{//没有传入val值，则取的自定义属性值
        return el.getAttribute(name)
    }
 }
