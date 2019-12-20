<template>
  <section class="grid-demo">
    <div class="grid">
      <div
        :class="['item', 'h' + tool.height, 'w' + tool.width, tool.color]"
        :data-id="tool.id"
        :data-color="tool.color"
        :data-title="tool.title"
        v-for="tool in toolList"
        :key="tool.id"
      >
        <div class="item-content">
          <div class="card">
            <div class="card-id">{{ tool.id }}</div>
            <div class="card-title">{{ tool.title }}</div>
            <div class="card-remove">
              <i class="material-icons">&#xE5CD;</i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Muuri from "muuri";
export default {
  name: "About",
  data() {
    return {
      toolList: [],
      grid: null,
      docElem: null,
      demo: null,
      gridElement: null,
      characters: "abcdefghijklmnopqrstuvwxyz",
      filterOptions: ["red", "blue", "green"],
      dragOrder: [],
      uuid: 0
    };
  },
  components: {},
  mounted() {
    this.docElem = document.documentElement;
    this.demo = document.querySelector(".grid-demo");
    this.gridElement = this.demo.querySelector(".grid");

    this.initDemo();
  },

  methods: {
    //
    // Grid helper functions
    //

    initDemo() {
      const amount = 20;
      let newList = [];
      for (var i = 0; i < amount; i++) {
        var id = ++this.uuid;
        var color = this.getRandomItem(this.filterOptions);
        var title = this.generateRandomWord(2);
        var width = Math.floor(Math.random() * 2) + 1;
        var height = Math.floor(Math.random() * 2) + 1;
        newList.push({ id, color, title, width, height });
      }
      this.toolList = [...newList];

      const vm = this;
      vm.$nextTick(() => {
        this.initGrid();

        // Add/remove items bindings.
        this.gridElement.addEventListener("click", function(e) {
          if (vm.elementMatches(e.target, ".card-remove, .card-remove i")) {
            vm.removeItem(e);
          }
        });
      });
    },

    initGrid() {
      var dragCounter = 0;
      const vm = this;

      this.grid = new Muuri(this.gridElement, {
        // items: generateElements(20),
        items: ".item",
        layoutDuration: 400,
        layoutEasing: "ease",
        dragEnabled: true,
        dragSortInterval: 50,
        dragContainer: document.body,
        dragStartPredicate: function(item, event) {
          var isDraggable = true; //sortFieldValue === "order";
          var isRemoveAction = vm.elementMatches(
            event.target,
            ".card-remove, .card-remove i"
          );
          return isDraggable && !isRemoveAction
            ? Muuri.ItemDrag.defaultStartPredicate(item, event)
            : false;
        },
        dragReleaseDuration: 400,
        dragReleseEasing: "ease"
      })
        .on("dragStart", function() {
          ++dragCounter;
          vm.docElem.classList.add("dragging");
        })
        .on("dragEnd", function() {
          if (--dragCounter < 1) {
            vm.docElem.classList.remove("dragging");
          }
        })
        .on("move", vm.updateIndices);
    },

    removeItem(e) {
      var elem = this.elementClosest(e.target, ".item");
      const vm = this;
      this.grid.hide(elem, {
        onFinish: function(items) {
          var item = items[0];
          vm.grid.remove(item, { removeElements: true });
          // if (sortFieldValue !== "order") {
          {
            var itemIndex = vm.dragOrder.indexOf(item);
            if (itemIndex > -1) {
              vm.dragOrder.splice(itemIndex, 1);
            }
          }
        }
      });
      this.updateIndices();
    },

    changeLayout() {
      this.grid.layout();
    },

    getRandomItem(collection) {
      return collection[Math.floor(Math.random() * collection.length)];
    },

    generateRandomWord(length) {
      var ret = "";
      for (var i = 0; i < length; i++) {
        ret += this.getRandomItem(this.characters);
      }
      return ret;
    },

    updateIndices() {
      this.grid.getItems().forEach(function(item, i) {
        item.getElement().setAttribute("data-id", i + 1);
        item.getElement().querySelector(".card-id").innerHTML = i + 1;
      });
    },

    elementMatches(element, selector) {
      var p = Element.prototype;
      return (
        p.matches ||
        p.matchesSelector ||
        p.webkitMatchesSelector ||
        p.mozMatchesSelector ||
        p.msMatchesSelector ||
        p.oMatchesSelector
      ).call(element, selector);
    },

    elementClosest(element, selector) {
      if (window.Element && !Element.prototype.closest) {
        var isMatch = this.elementMatches(element, selector);
        while (!isMatch && element && element !== document) {
          element = element.parentNode;
          isMatch =
            element &&
            element !== document &&
            this.elementMatches(element, selector);
        }
        return element && element !== document ? element : null;
      } else {
        return element.closest(selector);
      }
    }
  }
};
</script>

<style lang="css">
.grid {
  position: relative;
  max-width: 960px;
  margin: 0 -10px;
  -moz-box-sizing: content-box;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}
.item {
  position: absolute;
  width: 100px;
  height: 100px;
  line-height: 100px;
  margin: 10px;
  z-index: 1;
  will-change: transform;
}
.item.muuri-item-positioning {
  z-index: 2;
}
.item.muuri-item-dragging,
.item.muuri-item-releasing {
  z-index: 9999;
}
.item.muuri-item-dragging {
  cursor: move;
}
.item.muuri-item-hidden {
  z-index: 0;
}
.item.h2 {
  height: 220px;
  line-height: 220px;
}
.item.w2 {
  width: 220px;
}
.item-content {
  position: relative;
  width: 100%;
  height: 100%;
}
.card {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  font-size: 24px;
  font-weight: 300;
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid;
  color: #333;
  border-radius: 4px;
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  -ms-transition: all 0.2s ease-out;
  -o-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
}
.item.red .card {
  color: #f94a7a;
}
.item.green .card {
  color: #2ac06d;
}
.item.blue .card {
  color: #4a9ff9;
}
.card-id {
  position: absolute;
  left: 7px;
  top: 0;
  height: 30px;
  line-height: 30px;
  text-align: left;
  font-size: 16px;
  font-weight: 400;
}
.card-remove {
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  -moz-transform: scale(0);
  -webkit-transform: scale(0);
  -o-transform: scale(0);
  -ms-transform: scale(0);
  transform: scale(0);
  -webkit-transition: all 0.15s ease-out;
  -moz-transition: all 0.15s ease-out;
  -ms-transition: all 0.15s ease-out;
  -o-transition: all 0.15s ease-out;
  transition: all 0.15s ease-out;
}
.card:hover > .card-remove {
  -moz-transform: scale(1);
  -webkit-transform: scale(1);
  -o-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1);
}

/* Icons in the selector */
/* fallback */
@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/materialicons/v29/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2)
    format("woff2");
}

.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
}

/* Material icons */

.material-icons {
  display: inline-block;
  vertical-align: top;
  line-height: inherit;
  font-size: inherit;
}

/* Base */

* {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
html {
  overflow-y: scroll;
  overflow-x: hidden;
  background: #fff;
}
html.dragging body {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
body {
  position: relative;
  font-family: "Fira Sans", Helvetica, Arial, sans-serif;
  font-size: 18px;
  line-height: 1.5;
  margin: 0 20px;
  color: #6e6e6e;
}
a {
  color: #3396ff;
  text-decoration: none;
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  -ms-transition: all 0.2s ease-out;
  -o-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
}
a:hover {
  color: #ff4bd8;
}

/* Sections */

section {
  margin: 60px auto;
  padding-top: 0;
  max-width: 940px;
  border-top: 2px solid #e5e5e5;
  text-align: left;
}
</style>
