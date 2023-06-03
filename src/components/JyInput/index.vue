<template>
    <div class="input-box" @click="focusInputBox" ref="inputBox">
        <div class="search-engine">
            <i class="iconfont" :class="avtiveIcon" @click="showResult = true"></i>
        </div>
        <div class="search-input">
            <input type="text" placeholder="输入搜索内容" @click="showResult = false" autocomplete="off" v-model.trim="keyword"
                @input="getSuggest">
        </div>
    </div>
    <div class="input-suggest" v-if="!showResult && showSuggest && suggestList && suggestList.length && keyword">
        <div class="input-suggest-item text-over" v-for="item in suggestList" :key="item.id" @click="openHref(item)">
            {{ item }}
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
import { ref } from 'vue';
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

const focusInputBox = () => {
    (inputBox.value as unknown as HTMLElement)!.classList.add('active');
    showSuggest.value = true;
}

onClickOutside(inputBox, () => {
    if (isOutside.value) {
        (inputBox.value as unknown as HTMLElement)!.classList.remove('active');
        showSuggest.value = false;
        showResult.value = false;
    }
})

const openHref = (val: any) => {
    const a = document.createElement('a');
    a.setAttribute('href', resultUrl.value + val);
    a.setAttribute('target', '_blank');
    a.click();
}

let timer: NodeJS.Timeout | null = null;

const getSuggest = async () => {
    if (timer) {
        clearTimeout(timer);
    }
    if (!keyword.value) {
        suggestList.value = [];
        return;
    }
    timer = setTimeout(() => {
        getSuggestApi(keyword.value).then(res => {
            if (res.code === 200) {
                suggestList.value = res.data.suggestList;
            }
        });
    }, delay);
}
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
            border-radius: 15px;
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
        padding-right: 20px;

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
}

.input-suggest {
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
    flex-direction: column;
    z-index: 9999;
    padding: 5px;
    transition: all 0.5s ease-in-out;

    .input-suggest-item {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        cursor: pointer;
        border-radius: 10px;
        font-size: 14px;

        &:hover {
            background-color: rgba(0, 0, 0, 0.05);
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