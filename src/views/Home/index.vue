<template>
    <div style="height: 400%;transition: .5s all;" :style="`height:${pageList.length * 100}%`" id="page-list">
        <div class="page" :style="`height: ${1 / pageList.length * 100}%;`" :data-index="index"
            v-for="(item, index) in pageList" :key="index">
            <div class="section" @mousewheel="scroll($event)">
                <div class="card" :class="child.size" v-for="(child, index1) in item.children" :key="index1">
                    <div class="icon" @click="clickEvent()">
                        <img :src="child.icon">
                    </div>
                    <p class="text text-over unseleced">
                        {{ child.text }}
                    </p>
                </div>
                <div class="card default">
                    <div class="icon add" @click="pushNewItem(index)">
                        +
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div class="home-sidebar unseleced">
        <div class="home-sidedock">
            <div class="sidebar-item">
                <i class="iconfont icon-user"></i>
            </div>
            <div class="line"></div>
            <div class="sidebar-item-box">
                <div class="sidebar-item" :class="activeIndex === index ? 'active' : ''" @click="activeIndex = index"
                    v-for="(item, index) in pageList" :key="index">
                    {{ index }}
                </div>
            </div>
            <div class="line"></div>
            <div class="sidebar-item" @click="pushNewPage()">
                +
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, watch } from 'vue';
import { ElNotification } from 'element-plus';

interface PageList {
    children: PageItem[];
    title: string;
    icon: string;
}
interface PageItem {
    size: string;
    icon: string;
    text: string;
}

const activeIndex = ref(0);

const pageList = ref([] as PageList[]);

pageList.value = [
    {
        title: '1',
        icon: '/image/icon.png',
        children: [
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标1'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标2'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标3'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标4'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标5'
            },
        ]
    },
    {
        title: '2',
        icon: '/image/icon.png',
        children: [
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标1'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标2'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标3'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标4'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标5'
            },
        ]
    },
    {
        title: '3',
        icon: '/image/icon.png',
        children: [
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标1'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标2'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标3'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标4'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标5'
            },
        ]
    },
    {
        title: '3',
        icon: '/image/icon.png',
        children: [
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标1'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标2'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标3'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标4'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标5'
            },
        ]
    },
]

const pushNewPage = () => {
    pageList.value.push({
        children: [],
        title: '',
        icon: ''
    })
}

const pushNewItem = (index: number) => {
    console.log(index);
    pageList.value[index].children.push({
        size: 'default',
        icon: '/image/icon.png',
        text: '图标' + (pageList.value[index].children.length + 1)
    })
}

// 节流 防止滚动过快
const flag = ref(false);

const scroll = (event: WheelEvent) => {
    if (flag.value) {
        return;
    }
    const dom = doms.value[activeIndex.value].firstChild as HTMLElement;
    // 获取元素的滚动高度
    nextTick(() => {
        if ((dom.scrollHeight) === (dom.scrollTop + dom.clientHeight) && event.deltaY > 0) {
            if (activeIndex.value === pageList.value.length - 1) {
                return;
            }
            activeIndex.value++;
            flag.value = true;
            setTimeout(() => {
                flag.value = false;
            }, 300)
        } else if (dom.scrollTop === 0 && event.deltaY < 0) {
            if (activeIndex.value === 0) {
                return;
            }
            activeIndex.value--;
            flag.value = true;
            setTimeout(() => {
                flag.value = false;
            }, 300)
        }
    })
}

watch(activeIndex, (val) => {
    const dom = doms.value[val];
    (dom.firstChild as HTMLElement).style.overflow = "hidden";
    nextTick(() => {
        (doms.value[val].firstChild as HTMLElement).scrollTop = 0;
        dom.parentElement.style.transform = `translateY(-${val * 1 / pageList.value.length * 100}%)`;
    })

    // 让.sidebar-item-box 滚动到对应的位置
    nextTick(() => {
        document.querySelector(".sidebar-item-box").scrollTo({
            top: val * 1 / pageList.value.length * document.querySelector(".sidebar-item-box").scrollHeight,
            behavior: "smooth"
        })
    })
    // 延迟聚焦元素
    setTimeout(() => {
        (dom.firstChild as HTMLElement).style.overflow = "";
        (dom.firstChild as HTMLElement).focus();
    }, 300)
})

const oldLen = ref(0);

watch(pageList.value, (val) => {
    if (val.length > oldLen.value) {
        nextTick(() => {
            getAllSection();
            activeIndex.value = val.length - 1;
            oldLen.value = val.length;
            nextTick(() => {
                document.querySelector(".sidebar-item-box").scrollTo({
                    top: document.querySelector(".sidebar-item-box").scrollHeight,
                    behavior: "smooth"
                })
            })
        })
    }
}, { deep: true })

const doms = ref([] as HTMLElement[]);

const getAllSection = async () => {
    const set = new Set();
    document.getElementById("page-list").querySelectorAll(".page").forEach((item: any) => {
        set.add(item);
    })
    doms.value = <any>Array.from(set);
}

const clickEvent = () => {
    ElNotification.success({
        message: '点击事件',
        showClose: false,
        duration: 1000
    })
}

onMounted(() => {
    getAllSection();
    oldLen.value = pageList.value.length;
})

</script>

<style lang="less" scoped>
.home-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100px;
    background-color: transparent;
    z-index: 2;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .home-sidedock {
        width: 52px;
        height: 650px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 10px;
    }

    .line {
        width: 30px;
        height: 2px;
        background-color: var(--color-gray);
        opacity: .5;
        margin: 10px;
        border-radius: 10px;
    }

    .sidebar-item-box {
        width: 100%;
        height: 475px;
        text-align: center;
        overflow: auto;
    }

    .sidebar-item {
        width: 40px;
        height: 40px;
        background-color: transparent;
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        font-size: 20px;
        color: var(--color-gray);
        margin: 10px auto;


        &:hover,
        &.active {
            background-color: #ffffff26;
        }
    }
}

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
    max-height: 100vh;
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
            text-align: center;

            &.add {
                background-color: rgba(255, 255, 255, 0.3);
                color: var(--color-white);
                font-size: 25px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: normal;
                color: var(--color-gray);

                &:hover {
                    background-color: hsla(0, 0%, 100%, .5) !important;
                    color: rgba(0, 0, 0, .9) !important;
                }
            }

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