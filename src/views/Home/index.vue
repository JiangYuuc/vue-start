<template>
    <div style="height: 400%;transition: .5s all;" :style="`height:${totalPage * 100}%`">
        <div class="section" :style="`height: ${1 / totalPage * 100}%;`" :data-index="index" v-for="(_, index) in totalPage"
            :key="index" @mousewheel="scroll($event)">
            <div class="card" :class="randomSize()" v-for="(_, index) in len" :key="index">
                <div class="icon" @click="clickEvent()">
                    <img src="/image/icon.png">
                </div>
                <p class="text text-over unseleced">
                    图标{{ index + 1 }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue';
import { ElNotification } from 'element-plus';

const len = ref(0);

const randomLen = () => {
    len.value = Math.floor(Math.random() * 10) + 5;
}

const totalPage = ref(4);

const activeIndex = ref(0);

// 节流 防止滚动过快
const flag = ref(false);

const scroll = (event: WheelEvent) => {
    if (flag.value) {
        return;
    }
    const dom = doms.value[activeIndex.value];
    // 获取元素的滚动高度
    nextTick(() => {
        dom.style.visibility = '';
        if ((dom.scrollHeight) === (dom.scrollTop + dom.clientHeight) && event.deltaY > 0) {
            if (activeIndex.value === 4 - 1) {
                return;
            }
            activeIndex.value++;
            doms.value[activeIndex.value].style.visibility = '';
            nextTick(() => {
                doms.value[activeIndex.value].scrollTop = 0;
                dom.parentElement.style.transform = `translateY(-${activeIndex.value * 1 / totalPage.value * 100}%)`;
                dom.style.visibility = 'hidden';
            })
            flag.value = true;
            setTimeout(() => {
                flag.value = false;
            }, 300)
        } else if (dom.scrollTop === 0 && event.deltaY < 0) {
            if (activeIndex.value === 0) {
                return;
            }
            activeIndex.value--;
            doms.value[activeIndex.value].style.visibility = '';
            nextTick(() => {
                doms.value[activeIndex.value].scrollTop = 0;
                dom.parentElement.style.transform = `translateY(-${activeIndex.value * 1 / totalPage.value * 100}%)`;
                dom.style.visibility = 'hidden';
            })
            flag.value = true;
            setTimeout(() => {
                flag.value = false;
            }, 300)
        }
    })
}

const randomSize = () => {
    const size = ['default', 'middle', 'large', 'bigest']
    return size[Math.floor(Math.random() * size.length)]
    // return size[0]
}

const doms = ref([] as HTMLElement[]);

const init = () => {
    for (let i = 0; i < 28; i++) {
        document.querySelectorAll(".section").forEach((item: any) => {
            const dom = item;
            doms.value.push(dom);
        })
    }
}

const clickEvent = () => {
    ElNotification.success({
        message: '点击事件',
        showClose: false,
        duration: 1000
    })
}

onMounted(() => {
    randomLen();
    init();
})

</script>

<style lang="less" scoped>
.section {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    position: relative;
    z-index: 1;
    padding-top: 25vh;
    padding-bottom: 240px;
    max-width: 1200px;
    display: grid;
    grid-auto-flow: row dense;
    grid-template-columns: repeat(auto-fill, var(--icon-width-full));
    justify-content: center;
    overflow: auto;

    // 换行 
    .card {
        grid-column: span 1;
        grid-row: span 1;
        padding: var(--icon-padding-y) var(--icon-padding-x);

        &.middle {
            grid-column: span 2;
            grid-row: span 1;

            .icon {
                width: var(--icon-size-middle);
            }
        }

        &.large {
            grid-column: span 2;
            grid-row: span 2;

            .icon {
                width: var(--icon-size-middle);
                height: var(--icon-size-middle);
            }
        }

        &.bigest {
            grid-column: span 4;
            grid-row: span 2;

            .icon {
                width: var(--icon-size-bigest);
                height: var(--icon-size-middle);
            }
        }

        &.default {
            grid-column: span 1;
            grid-row: span 1;

            .icon {
                img {
                    display: block;
                }
            }
        }

        .icon {
            width: var(--icon-size);
            height: var(--icon-size);
            background-color: var(--color-white);
            border-radius: 20px;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: all 0.3s;
            overflow: hidden;

            &:hover {
                transform: scale(1.05);
                box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
            }

            img {
                display: none;
            }
        }

        .text {
            padding-top: 10px;
            font-size: 14px;
            color: var(--color-white);
            text-align: center;
        }
    }
}
</style>