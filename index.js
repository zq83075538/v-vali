import {API_URL} from '../../config'
/***mixin 方法***/
var Rules = {
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
    isPositiveInteger: function(val) {
        return /^[0-9]*[1-9][0-9]*$/.test(val);
    },
    minLength: function(val, rule) {
        if (isNaN(parseInt(rule))) {
            return true
        }
        return val.length >= parseInt(rule, 10)
    },
    maxLength: function(val, rule) {
        if (isNaN(parseInt(rule))) {
            return true
        }
        return val.length <= parseInt(rule, 10)
    },
    minSize: function(val, rule) {
        if (isNaN(parseInt(rule))) {
            return true
        }
        return Number(val) >= Number(rule)
    },
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
    isNumber: function(val) {
        return /^(-?[0-9]\d*|0)$/.test(val)
    },
    isEmail: function(val) {
        return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/i.test(val)
    },
    isMobile: function(val) {
        return /^1(3|4|5|7|8)\d{9}$/.test(val)
    },
    isUrl: function(val) {
        return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(val)
    },
    minDate: function(val, min) {
        if (typeof min != 'string' || min == null) return true
        try {
            return new Date(val.replace(/-/g, '/')).getTime() - new Date(min.replace(/-/g, '/')).getTime() >= 0
        } catch (e) {
            console.log(e)
        }
    },
    maxDate: function(val, max) {
        if (typeof max != 'string' || max == null) return true
        try {
            return new Date(val.replace(/-/g, '/')).getTime() - new Date(max.replace(/-/g, '/')).getTime() <= 0
        } catch (e) {
            console.log(e)
        }
    },
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
    isRepeat: function(val, Arr) {
        return Arr.indexOf(val) < 0
    },
    isIdCard: function(val) {
        return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(val)
    },
    isLegalName: function(val) {
        return /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(val);
    },
    unique: function(val){
        if($.isEmptyObject(this.unique))return true;
        let res = true;
        $.ajax({
            url:API_URL + '/attendee/paramUnique.json',
            async:false,
            data:$.extend({
                itemValue:val
            },this.unique),
            success:(data)=>{
                if(data.isError)return;
                res = data.data;
            }
        })
        return !res;
    }
}
var Step = {
    price: function(ev) {
        let obj = ev.target;
        var regStrs = [
            ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0  
            ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点  
            ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点  
            ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上  
        ];
        for (var i = 0; i < regStrs.length; i++) {
            var reg = new RegExp(regStrs[i][0]);
            obj.value = obj.value.replace(reg, regStrs[i][1]);
        }
        function fnEval(str) {
            eval(str);
        }
        (function setValue() {
            window.vm = ev.data.vm;
            window.nValue = ev.target.value;
            let str = '';
            $.each(ev.data.filed.split('.'), function(i, o) {
                str += '[\'' + o + '\']';
            })
            fnEval('vm' + str + '=nValue');
            delete window.vm;
            delete window.nValue;
        })()
    }
}
var Messages = {
    required: '必填',
    isNumber: '必须为数字',
    minLength: '不少于_$_个字',
    maxLength: '不多于_$_个字',
    minSize: '不小于_$_',
    maxSize: '不大于_$_',
    isEmail: '请输入正确的邮箱地址',
    isMobile: '请输入正确的手机号',
    minDate: '日期不能早于_$_',
    maxDate: '日期不能晚于_$_',
    isRepeat: '已存在',
    isIdCard: '请输入正确的身份证号',
    isPositiveInteger: '必须是正整数',
    isLegalName: '必须是中英文或数字组合',
    unique:'已被占用'
}
class Verify {
    constructor(vm, Vue) {
        this._vm = vm
        if (typeof Vue === 'function') {
            this.verifyQueue = [] //验证队列
            this.$errors = {} // 错误消息队列
            Vue.util.defineReactive(this, '$errors', {});
            this.$info = {} // 错误消息队列
            Vue.util.defineReactive(this, '$info', {});
        } else {
            $.extend(this, Vue)
        }
    }
    check() {
        var result = true
        var vm = this._vm
        return new Promise((reslove, reject) => {
            var que = this.verifyQueue;
            var data = {};
            $.each(que, function(i, item) {
                let name = item.name || item.filed;
                let fileds = item.filed.split('.') //如果多级路径 如： data.item.2.name 两处用到可抽离
                var currentData = $.extend(true, {}, vm)
                fileds.forEach(function(k) {
                    currentData = currentData[isNaN(parseInt(k))?k:parseInt(k)];
                })
                data[name] = currentData;
                let res = validate.call(vm, item.filed, currentData, item.rules, item.messages)
                if (!res) {
                    result = false;
                    item.el.focus();
                    return false;
                }
            })
            vm.$forceUpdate() //手动触发视图更新 否则$errors不工作
            result ? reslove.call(this, data) : reject(false)
        })
    }
    vali() { //filed val rules messages
        return validate.apply(this._vm, arguments)
    }
    filter(val) {
        var clone = $.extend({}, this);
        clone.verifyQueue = this.verifyQueue.filter((o, i) => {
            return o.filed.indexOf(val) != -1
        });
        return new Verify(this._vm, clone);
    }
    clear() {
        var vm = this._vm;
        $.each(this.$errors, (i, o) => {
            this.$errors[i] = '';
        })
        return this;
    }
    setValue(obj) {
        var que = this.verifyQueue;
        var vm = this._vm;
        var obj = obj || {}
        que.map(function(item) {
            let name = item.name || item.filed;
            let fileds = item.filed.split('.')
            let data = {};
            obj[name] = obj[name] || '';
            for (let i = fileds.length - 1; i >= 0; i--) {
                let value = $.isEmptyObject(data) ? obj[name] : $.extend(true, {}, data);
                data = {};
                data[fileds[i]] = value;
            }
            $.extend(true, vm, data);
        })
        return this;
    }
}
var verifyInit = function(Vue, options) {
        if (options && options.rules) {
            Object.assign(defaultRules, defaultRules, options.rules);
        }
        Vue.mixin({
            beforeCreate() {
                if (!this.$options.verify) { //组件的options的 verify 为定义 不执行，否则将为所有组件minin
                    return
                }
                this.$verify = new Verify(this, Vue) //添加vm实例验证属性
            }
        })
    }
    /**
     * 验证函数
     *
     * This function validate the  value of the rules.
     *
     * @param {*} val
     * @param {*} rules 
     * @param {*} messages 
     * @return {Boolean}
     */
function validate(filed, val, rules, messages) {
    if (rules.required !== true && (val === '' || val === null)) return true;
    let vm = this
    let result = true;
    let fnResult = undefined;
    messages = messages ? messages : Messages
    let aRule = Object.keys(rules);
    let errorsMsg
    for (let i = 0; i < aRule.length; i++) {
        let key = aRule[i]
        if (rules[key] === undefined || rules[key] === false) continue;
        if (typeof rules[key] == 'function') fnResult = rules[key](val);
        // console.log(RegExp(rules[key]))
        // if(RegExp(rules[key]))fnResult = rules[key].test(val);
        result = typeof fnResult !== 'undefined' ? fnResult : Rules[key].call(vm, val, rules[key]);
        // console.log(result,filed)
        if (filed === null && !result) {
            return result
        }
        if (typeof result == 'boolean' && !result) {
            errorsMsg = messages[key];
            //数字替换符号 _$_
            if (errorsMsg.indexOf('_$_') > -1) {
                errorsMsg = errorsMsg.replace('_$_', rules[key])
            }
            vm.$verify.$errors[filed] = errorsMsg
            return false
        } else {
            vm.$verify.$errors[filed] = ''
        }
        if (typeof result == 'number') {
            if (result == 0) {
                vm.$verify.$errors[filed] = messages[key];
            }
            vm.$verify.$info[filed] = result
        }
    }
    // for (var key in rules) {
    //   console.log(key)
    //   if(rules[key]!==false)
    //   result = Rules[key].call(vm, val, rules[key])
    //   console.log('验证结果：', result)
    //     //if one not validate passed , return 
    //   if (!result) {
    //     var errorsMsg = messages[key];
    //     //数字替换符号 _$_
    //     if (errorsMsg.indexOf('_$_') > -1) {
    //       errorsMsg = errorsMsg.replace('_$_', rules[key])
    //     }
    //     vm.$verify.$errors[filed] = errorsMsg
    //     return false
    //   }
    // }
    return result
}
/***注册指令***/
function Directive(Vue, options) {
    Vue.directive('vali', {
        bind: function(el, binding, vnode) {
            // console.log(binding)
            var vm = vnode.context; //当前组件实例
            let filed = el.getAttribute('filed');
            let name = el.name || '';
            let step = el.getAttribute('step');
            // console.log(el.getAttribute('message'), el)
            let messages = el.getAttribute('message') || Messages;
            // console.log(typeof messages == 'string')
            messages = typeof messages == 'string' ? $.extend({},Messages,JSON.parse(messages)) : messages;
            // console.log(messages)
            //添加数据监听绑定 getter setter view的$errors才能响应
            try {
                Vue.util.defineReactive(vm.$verify.$errors, filed, '');
            } catch (e) {
                console.log('请为组件添加verify参数')
            }
            let rules = binding.value
            rules = typeof rules == 'string' ? JSON.parse(rules) : rules
                //添加规则到验证队列
            let isPushed = (function() {
                    let has = false
                    vm.$verify.verifyQueue.forEach(function(item) {
                        if (item.filed == filed) {
                            return has = true
                        }
                    })
                    return has
                })()
                // 排除重复，checkbox radio 都有一组相同指令
                !isPushed && vm.$verify.verifyQueue.push({
                    el: el,
                    filed: filed,
                    rules: rules,
                    messages: messages,
                    name: name
                })
            let next = function(filed, rules, messages) {
                    return function() {
                        let fileds = filed.split('.') //如果多级路径 如： data.item.2.name
                        var currentData = vm
                        fileds.forEach(function(k) {
                            currentData = currentData[k]
                        })
                        validate.call(vm, filed, currentData, rules, messages)
                        vm.$forceUpdate()
                    }
                }(filed, rules, messages)
                // 给自定义插件添加事件方法
            let event = el.getAttribute('addEvent')
            if (event) {
                let eventname = event.split('##')[0]
                let ref = event.split('##')[1]
                if (ref) {
                    let refObj = vm.$refs[ref]
                    if (utils.isArray(vm.$refs[ref])) {
                        refObj = refObj[0]
                    }
                    refObj.$on(eventname, next)
                } else {
                    el.addEventListener(eventname, next, false)
                }
            } else {
                $(el).on('change', next)
            }
            // 输入错误自动返回正确结果
            if (step && Step[step])
                $(el).on('input', {
                    filed: filed,
                    vm: vm
                }, Step[step]);
        },
        unbind: function(el, binding, vnode, oldVnode) {
            let filed = vnode.data.attrs.filed;
            let vm = vnode.context;
            for (let i = vm.$verify.verifyQueue.length - 1; i >= 0; i--) {
                let item = vm.$verify.verifyQueue[i]
                if (item.filed == filed) {
                    vm.$verify.verifyQueue.splice(i, 1)
                    vm.$verify.$errors[filed] = ''
                }
            }
        },
        update:function(){
            // console.log('111')
        }
    })
}
var utils = {
    isArray: (o) => {
        return Object.prototype.toString.call(o).indexOf('Array') > -1
    }
}
var install = function(Vue, options) {
    verifyInit(Vue, options)
    Directive(Vue, options)
}
export default {install};