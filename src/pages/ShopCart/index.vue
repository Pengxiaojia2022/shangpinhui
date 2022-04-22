<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="(car, index) in cartInfoList" :key="index">
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="car.isChecked == '1'"
              @change="changeSingleChecked(car, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="car.imgUrl" />
            <div class="item-msg">
              {{ car.skuName }}
            </div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ car.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a class="mins" @click="handler('minus', -1, car)">-</a>
            <input
              autocomplete="off"
              type="text"
              minnum="1"
              class="itxt"
              :value="car.skuNum"
              @change="handler('change', $event.target.value, car)"
            />
            <a class="plus" @click="handler('add', 1, car)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ car.skuPrice * car.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteCart(car.skuId)">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="allChecked && cartInfoList.length > 0"
          @change="updateAllCartChecked"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">
          已选择 <span>{{ totalPrice.count }}</span
          >件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice.sum }}</i>
        </div>
        <div class="sumbtn">
          <router-link to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import throttle from "lodash/throttle";
export default {
  name: "ShopCart",
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters("shopcart", ["carList"]),
    cartInfoList() {
      return this.carList.cartInfoList || [];
    },
    totalPrice() {
      let sum = 0;
      let count = 0;
      this.cartInfoList.forEach((item) => {
        if (item.isChecked == "1") {
          count++;
        }
        sum += item.skuPrice * item.skuNum;
      });
      return { sum, count };
    },
    allChecked() {
      return this.cartInfoList.every((item) => {
        return item.isChecked == "1";
      });
    },
  },
  methods: {
    getData() {
      this.$store.dispatch("shopcart/getCarList");
    },
    handler: throttle(async function (type, disNum, car) {
      try {
        switch (type) {
          case "add":
            disNum = 1;
            break;
          case "minus":
            if (car.skuNum > 1) {
              disNum = -1;
            } else {
              disNum = 0;
            }
            break;
          case "change":
            // 此处不要给该输入框绑定v-model，绑定value值！！！！
            if (isNaN(disNum) || disNum < 1) {
              // 如果是非法的或者是负数，那么不变
              disNum = 0;
            } else {
              // 如果为小数
              disNum = parseInt(disNum) - car.skuNum;
            }
            break;
        }
        await this.$store.dispatch("shopcart/addOrUpdateShopCart", {
          skuId: car.skuId,
          skuNum: disNum,
        });
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    }, 1000),
    async changeSingleChecked(car, event) {
      try {
        let isChecked = event.target.checked * 1;
        await this.$store.dispatch("shopcart/checkCart", {
          skuId: car.skuId,
          isChecked,
        });
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    async updateAllCartChecked(event) {
      try {
        let isChecked = event.target.checked ? "1" : "0";
        await this.$store.dispatch("shopcart/updateAllCartChecked", isChecked);
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    async deleteCart(skuId) {
      // /api/cart/deleteCart/{skuId}  delete
      await this.$store.dispatch("shopcart/deleteCart", skuId);
      this.getData();
    },
    // 删除已选中的产品
    async deleteCheckedCart() {
      try {
        await this.$store.dispatch("shopcart/deleteCheckedCart");
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>