# vue-injecter

## 提供响应式的provide和inject

```
  由于vue原生的inject和provide是不可响应式的,为了使子组件能更方便的使用父组件的变量,
  或者把父组件作为存放点,在子组件间共享使用属性及方法,故将一些hack方式的注入抽象为一个工具库.
```
## 安装

```
npm install --save vue-injecter
```

## 使用


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

