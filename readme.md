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

  #### 1.简单使用

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
          b:2
        };
      },
      computed:{},
      methods:{
        hello(){
          console.log("hello")
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


  // 在子组件或多层嵌套子组件中可以直接使用或响应式的修改父组件的属性,可以使用父组件的任意方法
  <template>
    <div class='child-container'>
      <div @click="change">
        {{a}}
      </div>
      <div @click="hello">
        {{b}}
      </div>
    </div>
  </template>
  <script>
  import {$inject} from "vue-injecter"
  export default {
    name:"child",
    components:{},
    mixins:[ $inject({namespace:"test",keys:["a","b","hello"]}) ],
    props:{},
    data(){
      return {};
    },
    computed:{},
    methods:{
      change(){
        this.a = 250
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

#### 2.自定义使用

由于该小工具的实现方式是组合了多个vue的特性,故默认了一个flagkey为`$_$`,特定的字符串是为了保证不会  和vue组件中的属性或方法重名;可以在main.js中自定义该特征值如下:

```
  import provider from "vue-injecter";
  Vue.use(provider("someFlagKey"));
```

同时该方式会在vue的全生命周期中引入eventBus,并在父子组件中,兄弟组件中互通消息.$provide及$inject中的使用方式不变.

```
export default {
  mounted:{
    this.$bus.$on("say",function(words){
      console.log(words)
    })
  },
  methods:{
    hello(){
      this.$bus.$emit("say","hello");
    }
  }
};

```
