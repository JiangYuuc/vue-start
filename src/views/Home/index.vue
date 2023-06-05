<template>
    <JyInput />

    <div style="height: 400%;transition: .5s all;" :style="`height:${pageList.length * 100}%`" id="page-list">
        <div class="page" :style="`height: ${1 / pageList.length * 100}%;`" :data-index="index"
            v-for="(item, index) in pageList" :key="index">
            <div class="section" @mousewheel="scroll($event)">
                <div class="card unseleced" :class="child.size" v-for="(child, index1) in item.children" :key="index1"
                    :data-index="index1">
                    <div class="icon" @mousedown="mousedown" @mouseup="clickEvent">
                        <img :src="child.icon" draggable="false">
                    </div>
                    <p class="text text-over ">
                        {{ child.text }}
                    </p>
                </div>
                <div class="card default unseleced">
                    <div class="icon add" @click="pushNewItem(index)">
                        +
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="home-sidebar unseleced" @mouseenter="mouseenter" @mouseleave="mouseleave">
        <div class="home-sidedock" v-show="showHomeSidebar" ref="homeSidebar">
            <div class="sidebar-item">
                <i class="iconfont icon-user"></i>
            </div>
            <div class="line"></div>
            <div class="sidebar-item-box">
                <div class="sidebar-item" :class="activeIndex === index ? 'active' : ''" @click="activeIndex = index"
                    v-for="(item, index) in pageList" :key="index">
                    <i class="iconfont" :class="item.icon"></i>
                </div>
            </div>
            <div class="line"></div>
            <div class="sidebar-item" @click="pushNewPage()">
                +
            </div>
        </div>
        <i class="iconfont icon-setting"></i>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, watch } from 'vue';
import { ElNotification } from 'element-plus';
import JyInput from '@/components/JyInput/index.vue';

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
        icon: 'icon-caidaniconshouyehui',
        children: [
            {
                size: 'bigest',
                icon: '/image/icon.png',
                text: '图标1'
            },
            {
                size: 'middle',
                icon: '/image/icon.png',
                text: '图标2'
            },
            {
                size: 'default',
                icon: '/image/icon.png',
                text: '图标3'
            },
            {
                size: 'middle',
                icon: '/image/icon.png',
                text: '图标4'
            },
            {
                size: 'large',
                icon: '/image/icon.png',
                text: '图标5'
            },
        ]
    },
    {
        title: '2',
        icon: 'icon-xiaochengxu',
        children: [
            {
                size: 'bigest',
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
        icon: 'icon-xiaochengxu',
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
        icon: 'icon-xiaochengxu',
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

let x = 0;
let y = 0;
let timer: string | number | NodeJS.Timeout = null;
let isClick = false;
const showHomeSidebar = ref(false);

const mousedown = (event: MouseEvent) => {
    const target = (event.currentTarget as HTMLElement).parentElement;
    // 获取点击时的时间
    x = event.clientX;
    y = event.clientY;
    if (target) {
        timer = setTimeout(() => {
            // 创建一个元素 复制target的所有属性
            const clone = target.cloneNode(true) as HTMLElement;
            clone.classList.add('drag');
            target.classList.add('hide');
            clone.addEventListener('mousemove', mousemove);
            clone.addEventListener('mouseup', mouseup);
            clone.style.position = "absolute"
            clone.style.left = `${event.clientX - target.clientWidth / 2}px`;
            clone.style.top = `${event.clientY - target.clientHeight / 2}px`;
            clone.style.zIndex = '999999';
            document.getElementById('app')?.appendChild(clone);
            isClick = false;
            mouseenter();
            return;
        }, 100);
        isClick = true;
    }
}

const mousemove = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    if (target) {
        target.style.transform = `translate(${event.clientX - x}px, ${event.clientY - y}px)`;
        // 判断元素是否经过类名带有card元素（有很多） 如果经过则将隐藏的元素移到 card元素的前面
    }
}
const mouseup = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    if (target) {
        target.removeEventListener('mousemove', mousemove);
        target.remove();
        document.querySelectorAll('.hide').forEach(item => {
            item.classList.remove('hide');
        })
        mouseleave();
    }
}

let showHomeSidebarTimer: string | number | NodeJS.Timeout = null;
let showHomeSidebarTimer2: string | number | NodeJS.Timeout = null;
const homeSidebar = ref(null as unknown as HTMLElement);

const mouseenter = () => {
    homeSidebar.value.classList.remove('show');
    clearTimeout(showHomeSidebarTimer2);
    clearTimeout(showHomeSidebarTimer);
    showHomeSidebar.value = true;
}

const mouseleave = () => {
    showHomeSidebarTimer = setTimeout(() => {
        homeSidebar.value.classList.add('show')
        showHomeSidebarTimer2 = setTimeout(() => {
            showHomeSidebar.value = false;
        }, 450)
    }, 1000);
}

const pushNewPage = () => {
    pageList.value.push({
        children: [],
        title: '',
        icon: 'icon-xiaochengxu'
    })
}

const pushNewItem = (index: number) => {
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
        if ((dom.scrollHeight) === Math.floor(dom.scrollTop + dom.clientHeight) && event.deltaY > 0) {
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
    doms.value = Array.from(set) as any;
}

const clickEvent = () => {
    if (isClick) {
        clearTimeout(timer);
        ElNotification.success({
            message: '点击事件',
            showClose: false,
            duration: 1000
        })
    }
}

onMounted(() => {
    getAllSection();
    oldLen.value = pageList.value.length;
})

</script>

<style lang="less">
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

    .icon-setting {
        font-size: 25px;
        color: var(--color-white);
        margin-bottom: 20px;
        cursor: pointer;
        position: absolute;
        bottom: 30px;
    }

    .home-sidedock {
        width: 52px;
        height: 500px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 10px;
        animation: showHomeSidebarLeft .5s;

        &.show {
            animation: hideHomeSidebarLeft .5s;
        }
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
        height: 350px;
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

@keyframes showHomeSidebarLeft {
    0% {
        transform: translateX(-200%);
    }

    100% {
        transform: translateX(0);
    }
}

@keyframes hideHomeSidebarLeft {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-200%);
    }
}

.page {
    position: relative;
    left: 0;
    right: 0;
    width: 70%;
    left: 50%;
    transform: translateX(-50%);
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
    display: grid;
    grid-auto-flow: row dense;
    grid-template-columns: repeat(auto-fill, var(--icon-width-full));
    justify-content: center;
    max-height: 100vh;
    overflow-y: auto;
    width: 100%;

    @media screen and (max-width: 700px) {
        & {
            grid-template-columns: repeat(4, var(--icon-width-full));
            justify-content: space-evenly;

            .card {
                &.bigest {
                    .icon {
                        width: 100% !important;
                    }
                }
            }
        }
    }

    @media screen and (max-width: 440px) {
        & {
            grid-template-columns: repeat(2, var(--icon-width-full));
        }
    }

}

.card {
    grid-column: span 1;
    grid-row: span 1;
    padding: var(--icon-padding-y) var(--icon-padding-x);

    &.drag {
        cursor: move;

        .icon:hover {
            transform: translateY(0) !important;
        }

        .text {
            display: none;
        }
    }

    &.hide {
        opacity: 0;
    }

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
        background-color: var(--color-gray);
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
            transform: translateY(-5px);
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
</style>