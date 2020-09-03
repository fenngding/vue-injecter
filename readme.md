# vue-injecter : 提供响应式的provide和inject

## 使用原因

```
原生:
  1. vue原生的inject和provide是不支持响应式的
  2. vue原生的provide属性是不支持根部修改的(比如父组件提供属性a, 子组件可以通过this.a使用,但修改不会改变父组件的属性值a)
  
该工具: 
  1. 响应式的同步修改,子组件或嵌套子组件及父组件均能响应式视图更新
  2. 可以修改根属性,不管是传值引用还是传址引用的属性值,修改后都会对父组件产生视图数据层的影响
  3. 该工具只是一种hack方式结合了vue的一些特性,支持跨组件使用,不需要在嵌套关系中一层层引入
```
## 安装

```
npm install --save vue-injecter
```

## 使用
支持vue2.2.0及以后的版本(vue3.0不支持)

  ```
    // 父组件中:
    <template>
      <div class='parent-container'>
        {{a}} --- {{b}}
      </div>
    </template>
    <script>
    import {$provide} from "vue-injecter"
    export default {
      name:"parent",
      components:{},
      mixins:[$provide({namespace:"test"})],
      props:{},
      data(){
        return {
          a:1,
          b:2,
          c:"parent"
        };
      },
      computed:{},
      methods:{
        hello(){
          console.log(this.c)
        }
      }
    };
    </script>
    <style scoped lang="scss">
    .parent-container{
      width:100%;
    }
    </style>
  // namespace需自定义为一个唯一值


  // 在子组件或多层嵌套子组件中可以直接使用或响应式的修改父组件的属性,可以使用父组件的任意方法(方法this的指向是父组件)
  <template>
    <div class='child-container'>
      <div @click="change">
        {{a}}
      </div>
      <div @click="helloWord">
        {{b}}
      </div>
    </div>
  </template>
  <script>
  import {$inject} from "vue-injecter"
  export default {
    name:"child",
    components:{},
    // 将需要引入的父组件的属性或者方法在keys中列出
    mixins:[ $inject({namespace:"test",keys:["a","b","hello"]}) ],
    props:{},
    data(){
      return {
        c:"children"
      };
    },
    computed:{},
    methods:{
      change(){
        // 该方法会响应式的修改父组件的a属性,同时也会响应式的在子组件或嵌套子组件的视图层和数据层响应式同步修改
        this.a = 250
      },
      helloWord(){
        this.hello()
        // 执行结果为:"parent" (因为hello方法内的this指向的是父组件)
      }
    }
  };
  </script>
  <style scoped lang="scss">
  .child-container{
    width:100%;
  }
  </style>

  ```

