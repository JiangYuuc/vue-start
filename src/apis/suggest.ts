import request from "@/utils/http";

export const getSuggestApi = (keyword: string) => {
    return request({
        url: `http://start-api.jyab.cn/suggest/${keyword}`,
        method: 'get'
    })
}