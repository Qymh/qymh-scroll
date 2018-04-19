(function(global,factory){
  typeof exports ==='object'&&typeof module!==undefined?module.exports=factory():
  typeof define==='function'&&define.amd?define(factory):
  (global.QymhScroll=factory())
})(this,(function(){
  'use strict'
  class QymhScroll{
    constructor(options){
      const doc=document.documentElement
      // 视口高度
      const viewClientHeight=doc.clientHeight||window.innerHeight||document.body.clientHeight
      // 基础配置
      const baseOptions={
        el:'',
        offsetBottom:0,
        allowDistance:50,
        loadingDom:'<div class="q_infiniteLoading q_infiniteLoading_hide">正在加载...</div>',
        finishDom:'<div class="q_infiniteOver q_infiniteOver_hide ">没有更多数据</div>',
        loadingFn:()=>{},
        page:{
          num:1,
          size:10
        }
      }
      // 配置项
      this.$options=Object.assign(baseOptions,options)
      // 挂载dom类名
      this.el=this.$options.el
      // 挂载dom
      this.$el=document.getElementsByClassName(this.el)[0]
      // 挂载dom的视口高度
      this.elClientHeight=this.$el.clientHeight
      // 挂载dom距离顶部的高度
      this.offsetTop=this.$el.offsetTop
      // 挂载dom距离底部的高度
      this.offsetBottom=this.$options.offsetBottom
      // 允许挂载dom距离底部的高度
      this.allowDistance=this.$options.allowDistance
      // 页面视口高度
      this.viewClientHeight=viewClientHeight
      // 加载的dom
      this.loadingDom=this.domParser(this.$options.loadingDom)
      // 加载完成后的dom
      this.finishDom=this.domParser(this.$options.finishDom)
      // 是否正在加载
      this.isLoading=false
      // 是否加载完成
      this.isFinish=false
      // 加载页数
      this.page=this.$options.page
      // 加载事件
      this.loadingFn=this.$options.loadingFn
      this.init()
    }
    // 初始化
    init(){
      if(Array.from(document.getElementsByClassName(this.el)).length>1){
        this.error(`${this.$options.el}类名不允许在同一个页面存在两个或以上!`)
        return
      }
      
      /** 事件 **/
      window.addEventListener('scroll',this.scrollerEvent.bind(this))
      
      /** dom **/
      let $front=this.$el.nextElementSibling
      let $parent=this.$el.parentNode
      let $bornEl=document.createElement('div')
      let $noticeEl=document.createElement('div')
      $bornEl.classList.add('qymh_scroll')
      $bornEl.style.marginBottom=this.offsetBottom+'px'
      $noticeEl.appendChild(this.loadingDom)
      $noticeEl.appendChild(this.finishDom)
      $noticeEl.classList.add('qymh_notice')
      $bornEl.appendChild(this.$el)
      $bornEl.appendChild($noticeEl)
      $front
      ?$parent.insertBefore($bornEl,$front)
      :$parent.appendChild($bornEl)
    }

    /**
     * 错误信息输出
     * @param {String} infor 错误信息
     */
    error(infor){
      console.error(`[error]:${infor}`)
    }

    /**
     * 解析dom
     * @param {String} stringHtml html字符串
     * @returns 解析后的dom
     */
    domParser(stringHtml){
      let outerDom=document.createElement('div')
      outerDom.innerHTML=stringHtml

      let children=Array.from(outerDom.children)
      if(children.length>1){
        this.error(`${stringHtml}只允许有一个外层div`)
        return
      }else{
        return children[0]
      }
    }
    
    /**
     * 滚动事件
     */
    scrollerEvent(){
      if(this.isFinish){
        return
      }
      this.elClientHeight=this.$el.clientHeight
      this.offsetTop=this.$el.offsetTop
      this.viewClientHeight=document.documentElement.clientHeight||window.innerHeight||document.body.clientHeight

      let scrollTop=window.pageYOffset||document.documentElement.scrollTop
      let computedClientHeight=this.elClientHeight+this.offsetTop+this.offsetBottom
      let computedScrollTop=scrollTop+this.viewClientHeight
      let bool=(computedScrollTop+this.allowDistance)>=computedClientHeight
      if(bool&&!this.isLoading){
        this.baseLoadingFn()
      }
    }

    /**
     * 处于加载事件
     */
    baseLoadingFn(){
      this.isLoading=true
      this.loadingDom.style.display='flex'
      this.loadingFn.call(null,this.page)
    }

    /**
     * 加载完成事件
     */
    infiniteSuccess(pageSize,pageCount){
      let total=pageSize*pageCount
      let $itemsLength=this.$el.children.length
      let laterLength=$itemsLength+pageSize

      this.loadingDom.style.display='none'
      this.isLoading=false

      if(laterLength>=total){
        this.isLoading=true
        this.isFinish=true
        this.finishDom.style.display='flex'
      }
    }
  }
  return QymhScroll
}))