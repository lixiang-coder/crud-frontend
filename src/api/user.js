import request from "@/utils/request";

// 获取所有用户
export function userGetAllService() {
    return request.get("/user/getAll")
}

// 条件分页查询用户
export function userSelectService(params) {
    return request.get("/user/page02", { params: params })
}

// 新增用户
export function userAddService(userModel) {
    return request.post("/user/add", userModel)
}

// 根据id删除用户
export const userDeleteService = (id) => {
    return request.delete('/user/deleteById/' + id)
}

// 根据id批量删除用户
export const userDeleteByIdsService = (ids) => {
    return request.delete("/user/deleteByIds/" + ids)
}

// 根据id修改用户
export const userUpdateService = (userModel) => {
    return request.put('user/update', userModel)
}

// 用户数据导出
export const userExportService = () => {
    return request.get('user/export')
}
