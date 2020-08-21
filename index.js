/* eslint-disable require-jsdoc */
/*
 * @Author: Fenngding
 * @Date: 2020-08-06 22:07:42
 * @LastEditors: Fengding
 * @LastEditTime: 2020-08-07 00:08:55
 * @Email: fenngding@live.com
 * @Description:
 */

/*
 * 用于从高层级组件向低层级组件传值
 * @export
 * @param {*} obj
 * @returns
 */
// 导出该插件
let flagKey = "$_$";
const sharedObjects = {};
export default function(key = "$_$"){
  flagKey = key;
  return {
    install:function(Vue){
      const EventBus = new Vue();
      Object.defineProperties(Vue.prototype, {
        $bus: {
          get: function () {
            return EventBus;
          }
        },
      });
    }
  };
}

export function $provide({ namespace = "test" }){
  if(sharedObjects[namespace + flagKey]){
    throw new Error(`命名空间${namespace}已被使用过`);
  }else{
    sharedObjects[namespace + flagKey] = true;
  }
  return {
    provide(){
      return { [namespace + flagKey]:this };
    }
  };
}

export function $inject({ namespace = "test",keys }){
  const computed = {};
  keys.forEach(injectKey=>{
    computed[injectKey] = {
      get(){
        return this[namespace + flagKey][injectKey];
      },
      set(val){
        if(this[namespace + flagKey][injectKey] instanceof Function){
          throw new Error(`禁止对父级函数${injectKey}进行重写`);
        }else{
          this[namespace + flagKey][injectKey] = val;
        }
      }
    };
  });
  return {
    inject:[ namespace + flagKey ],
    computed
  };
}