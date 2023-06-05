<template>
    <div class="input-box" @click="focusInputBox" ref="inputBox">
        <div class="search-engine">
            <i class="iconfont" :class="avtiveIcon" @click="showResult = true"></i>
        </div>
        <div class="search-input">
            <input type="text" placeholder="输入搜索内容" @click="showResult = false" autocomplete="off" v-model.trim="keyword"
                @keydown.down.prevent="down()" @keydown.up.prevent="up()" @keydown.enter="search">
        </div>
        <div class="search-btn" @click="search">
            <i class="iconfont icon-search"></i>
        </div>
    </div>
    <div class="input-suggest" :style="`height: ${40 * suggestList.length}px;`"
        v-if="!showResult && showSuggest && suggestList && suggestList.length && keyword">
        <div class="input-suggest-item text-over" v-for="(item, index) in suggestList"
            :class="activeSuggestIndex === index ? 'active' : ''" :key="item.id" @click="openHref(item)">
            <i class="iconfont icon-search" style="margin-right: 5px;"></i>{{ item }}
        </div>
    </div>
    <div class="history-list" v-if="!keyword && showSuggest && historyList && historyList.length">
        <div class="history-list-item-box">
            <p class="history-list-title">搜索历史</p>
            <p class="clean-histroy" @click="cleanHistroy">清空历史</p>
            <div class="history-list-item text-over" v-for="item in historyList" :key="item" @click="openHref(item)">
                <i class="iconfont icon-close" @click.stop="removeHistory(item)"></i>
                {{ item }}
            </div>
        </div>
    </div>

    <div class="result-list" ref="resultBox" v-if="showResult" @click.stop="focusInputBox">
        <div class="result-list-item" v-for="item in resultUrlList" :key="item.name"
            @click="resultUrl = item.url; avtiveIcon = item.icon; showResult = false">
            <i class="iconfont" :class="item.icon"></i>
            <p>{{ item.name }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { onClickOutside, useMouseInElement } from '@vueuse/core';
import { getSuggestApi } from "@/apis/suggest"


const inputBox = ref(null);
const resultBox = ref(null);
const avtiveIcon = ref("icon-baidu");
const keyword = ref("");
const { isOutside } = useMouseInElement(resultBox)

const suggestList = ref([]);

const delay = 50;

const resultUrl = ref("https://www.baidu.com/s?wd=");

const resultUrlList = ref([
    {
        name: "百度",
        url: "https://www.baidu.com/s?wd=",
        icon: "icon-baidu"
    },
    {
        name: "谷歌",
        url: "https://www.google.com/search?q=",
        icon: "icon-guge"
    },
    {
        name: "必应",
        url: "https://www.bing.com/search?q=",
        icon: "icon-biying"
    }
])

const showSuggest = ref(false);
const showResult = ref(false);
const isInput = ref(true);
const activeSuggestIndex = ref(-1);

const focusInputBox = () => {
    (inputBox.value as unknown as HTMLElement)!.classList.add('active');
    showSuggest.value = true;
}

const search = () => {
    if (keyword.value) {
        openHref(keyword.value);
    }
}

const down = () => {
    isInput.value = false;
    if (activeSuggestIndex.value < suggestList.value.length - 1) {
        activeSuggestIndex.value++;
    } else {
        activeSuggestIndex.value = 0;
    }
    keyword.value = suggestList.value[activeSuggestIndex.value];
}

const up = () => {
    isInput.value = true;
    if (activeSuggestIndex.value > 0) {
        activeSuggestIndex.value--;
    } else {
        activeSuggestIndex.value = suggestList.value.length - 1;
    }
    keyword.value = suggestList.value[activeSuggestIndex.value];
}

onClickOutside(inputBox, () => {
    if (isOutside.value) {
        (inputBox.value as unknown as HTMLElement)!.classList.remove('active');
        showSuggest.value = false;
        showResult.value = false;
    }
})

const historyList = ref([]);
historyList.value = Array.from(new Set(JSON.parse(localStorage.getItem('historyList') || '[]')));

const removeHistory = (val: any) => {
    focusInputBox();
    historyList.value = historyList.value.filter(item => item !== val);
    localStorage.setItem('historyList', JSON.stringify(historyList.value));
}

const cleanHistroy = () => {
    focusInputBox();
    historyList.value = [];
    localStorage.setItem('historyList', JSON.stringify(historyList.value));
}

const openHref = (val: any) => {
    const a = document.createElement('a');
    a.setAttribute('href', resultUrl.value + val);
    a.setAttribute('target', '_blank');
    a.click();
    focusInputBox()
    historyList.value.unshift(val);
    historyList.value = Array.from(new Set(historyList.value));
    localStorage.setItem('historyList', JSON.stringify(historyList.value));
}

let timer: NodeJS.Timeout | null = null;

watch(keyword, () => {
    if (!isInput.value) {
        isInput.value = true;
        return;
    } else {
        activeSuggestIndex.value = -1;
        isInput.value = true;
    }
    if (timer) {
        clearTimeout(timer);
    }
    if (!keyword.value) {
        suggestList.value = [];
        return;
    }
    timer = setTimeout(() => {
        getSuggestApi(encodeURIComponent(keyword.value)).then(res => {
            if (res.code === 200) {
                suggestList.value = res.data.suggestList;
            }
        });
    }, delay);
})
</script>

<style lang="less" scoped>
.input-box {
    width: 70%;
    max-width: 600px;
    height: 50px;
    position: fixed;
    top: 120px;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.75);
    display: flex;
    align-items: center;
    z-index: 9999;

    &.active {
        background-color: rgba(255, 255, 255, 0.9);
    }

    .search-engine {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;

            &:hover {
                background-color: rgba(255, 255, 255, 0.8);
            }
        }


    }

    .search-input {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        input {
            width: 100%;
            height: 40px;
            border-radius: 15px;
            border: none;
            outline: none;
            font-size: 16px;
            background-color: transparent;
        }
    }

    .search-btn {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;

            &:hover {
                background-color: rgba(255, 255, 255, 0.8);
            }
        }
    }
}

.input-suggest {
    height: 0;
    width: 70%;
    max-width: 600px;
    position: fixed;
    top: 185px;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    flex-direction: column;
    z-index: 9999;
    padding: 5px;

    .input-suggest-item {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        cursor: pointer;
        border-radius: 10px;
        font-size: 14px;

        &:hover,
        &.active {
            background-color: rgba(0, 0, 0, 0.05);
        }
    }
}

.history-list {
    height: auto;
    width: 70%;
    max-width: 600px;
    position: fixed;
    top: 185px;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    z-index: 9999;
    padding: 5px;
    transition: all 0.5s ease-in-out;

    .history-list-item-box {
        width: 100%;
        position: relative;
        display: flex;
        flex-wrap: wrap;

        .clean-histroy {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            padding: 0 10px;
            font-size: 14px;
            cursor: pointer;
            height: 40px;
            align-items: center;
        }
    }

    .history-list-title {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        border-radius: 10px;
        padding: 0 10px;
        font-size: 14px;
    }

    .history-list-item {
        max-width: 200px;
        line-height: 40px;
        padding: 0 20px;
        cursor: pointer;
        border-radius: 10px;
        font-size: 14px;
        background-color: #fff;
        margin: 10px 5px;
        position: relative;

        &:hover {
            background-color: rgba(0, 0, 0, 0.05);

            .icon-close {
                display: flex;
            }
        }

        .icon-close {
            border: 1px solid #666;
            position: absolute;
            top: 5px;
            right: 5px;
            width: 15px;
            height: 15px;
            display: none;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
            font-size: 12px;
            margin-left: 5px;

            &:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }
        }
    }
}

.result-list {
    height: auto;
    width: 70%;
    max-width: 600px;
    position: fixed;
    top: 185px;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    z-index: 9999;
    padding: 20px;
    transition: all 0.3s ease-in-out;

    .result-list-item {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        cursor: pointer;
        border-radius: 10px;
        font-size: 14px;
        flex-direction: column;

        i {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            margin-bottom: 5px;

            &:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }
        }

    }
}
</style>