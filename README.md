项目是基于Vue
install安装
```bash
npm i -D v-vali
```
引入 include
```js
import v-vali from 'v-vali'
Vue.use()
```
.vue文件中怎么用 How to use 
```html
<template>
<div>
<input v-vali="titleRules.rules" :message="titleRules.rules" filed="title" v-model="title">

<div class="ui top pointing red basic label " v-show="$verify.$errors['title']&&$verify.$errors['title']!=''">{{$verify.$errors['title']}} </div>
<button @click="check">验证</button>
</div>
<script>
  {
    ...
    name:'',
    verify:true,
    data(){
        return {
            title:'',
            'titleRules': {
                rules: {
                    required: true,
                    minLength: 5,
                    maxLength: 100,
                    isLegalName: true,   //不能包含特殊字符
                    titleRepeat: (val) => {
                        let data = this.id ? {
                            eventId: this.id,
                            title: val
                        } : { title: val }
                        let res = true;
                        $.ajax({
                            url: API_URL + '/event/isDuplicatedEventTitle.json',
                            data: data,
                            async: false,
                            success: (data) => {
                                res = !!data.data.isDuplicatedEventTitle
                            }
                        });
                        return !res;
                    }
                },
                message: {
                    titleRepeat: '该活动名称已存在'
                }
            }
        }
    },
    methods:{
        check(){
            this.$verify.check().then(()=>{
                //验证通过
                dosomething()
            })
        }
    }

  }
</script>
```


默认的验证方法有：

```json
<!-- 必填 -->
    required: function(val, leng) {
        if (val === '' || val == null) return false;
        if (typeof leng == 'number') {
            if (typeof val === 'string') val = val.split(',')
            if (leng > val.length) return false;
            let b = true;
            for (let i = 0; i < leng; i++) {
                if (val[i] == '') {
                    b = false;
                    break;
                }
            }
            return b;
        } else {
            if (typeof val === 'object' && val.length == 0) return false;
            return true;
        }
    },
    <!-- 整数 -->
    isPositiveInteger: function(val) {
        return /^[0-9]*[1-9][0-9]*$/.test(val);
    },
    <!-- 最小长度 -->
    minLength: function(val, rule) {
        if (isNaN(parseInt(rule))) {
            return true
        }
        return val.length >= parseInt(rule, 10)
    },
    <!-- 最大长度 -->
    maxLength: function(val, rule) {
        if (isNaN(parseInt(rule))) {
            return true
        }
        return val.length <= parseInt(rule, 10)
    },
    <!-- 最小数字 -->
    minSize: function(val, rule) {
        if (isNaN(parseInt(rule))) {
            return true
        }
        return Number(val) >= Number(rule)
    },
    <!-- 最大数 -->
    maxSize: function(val, rule) {
        if (isNaN(parseInt(rule))) {
            return true
        }
        return Number(val) <= Number(rule)
    },
    /**
     * isInteger
     *
     * This function check whether the value of the string is integer.
     *
     * @param {String} val
     * @return {Boolean}
     */
    <!-- 数字 -->
    isNumber: function(val) {
        return /^(-?[0-9]\d*|0)$/.test(val)
    },
    <!-- 邮箱 -->
    isEmail: function(val) {
        return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/i.test(val)
    },
    <!-- 手机号 -->
    isMobile: function(val) {
        return /^1(3|4|5|7|8)\d{9}$/.test(val)
    },
    <!-- 链接 -->
    isUrl: function(val) {
        return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(val)
    },
    <!-- 最小时间 -->
    minDate: function(val, min) {
        if (typeof min != 'string' || min == null) return true
        try {
            return new Date(val.replace(/-/g, '/')).getTime() - new Date(min.replace(/-/g, '/')).getTime() >= 0
        } catch (e) {
            console.log(e)
        }
    },
    <!-- 最大时间 -->
    maxDate: function(val, max) {
        if (typeof max != 'string' || max == null) return true
        try {
            return new Date(val.replace(/-/g, '/')).getTime() - new Date(max.replace(/-/g, '/')).getTime() <= 0
        } catch (e) {
            console.log(e)
        }
    },
    <!-- 密码的强度验证，错误信息会返回0，1，2，3 -->
    passwordstrength: function(val) {
        let s = 0
        if (val.length >= 6 && val.length <= 32) {
            if (/[a-zA-Z]/.test(val)) {
                s++;
            };
            if (/[0-9]/.test(val)) {
                s++;
            };
            if (/\W/.test(val)) {
                s++;
            };
        }
        return s
    },
    <!-- v-vali="{isRepeat:[1,2,3]}" 若填了1,会返回false -->
    isRepeat: function(val, Arr) {
        return Arr.indexOf(val) < 0
    },
    <!-- 验证身份证 -->
    isIdCard: function(val) {
        return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(val)
    },
    <!-- 中文，英文，或数字 -->
    isLegalName: function(val) {
        return /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(val);
    }
```

输入阻止
```html
<template>
    <div>
    <!-- 这样只能输入价格 -->
        <input type="number" step="price">
    </div>
</template>
```


$verify对象提供的方法

```js
//check整体验证
this.$verify.check().then(()=>{})



//vali单条验证
this.$verify.vali('')//filed=对应的data某个值[string]; val=输入的内容[string]; rules=验证规则[object] messages 错误信息[object]



this.$verify.filter('通个对象中的几个要验证的').check().then(()=>{})//参数为string类型，代表要验证的对象的名字



this.$verify.clear()//清除错误信息


this.$verify.setValue({title:''})//设置值

```
