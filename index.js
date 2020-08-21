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

const noncestr = function(length = 10){
  let str = "",
    arr = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
  // 随机产生，i为指定长度
  for (let i = 0; i < length; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
};

let flagKey = noncestr();
const sharedObjects = {};
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
