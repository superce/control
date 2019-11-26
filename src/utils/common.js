// 格式化时间
export function dateFormat(date){   
    if(date){
        let time = date.split('T')
        let year = time[0]
        let day = time[1]
        return `${year} ${day}`   
    }
}

// 滚动
export function scroll(scroll){
    // const windowHeight = window.screen.height
    // const documentHeight = document.documentElement.offsetHeight
    // console.log(documentHeight,scrollHeight,windowHeight)
    // if(scrollHeight+documentHeight>windowHeight+100){
        //   console.log(123)
    // }
    const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
    this.$emit('scroll',false)
    if(scrollHeight>=170){
        this.isScroll=true
        this.$emit('scroll',true)
        console.log(this.isScroll)
    }
}