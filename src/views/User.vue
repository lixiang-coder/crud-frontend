<script setup>
// 导入自定义的js
import {
  userGetAllService,
  userUpdateService,
  userAddService,
  userDeleteService,
  userSelectService,
  userDeleteByIdsService,
  userExportService
} from '../api/user.js'

import {ref} from "vue"

// 按钮图标样式
import {Delete, Edit, Search, Upload, Share} from '@element-plus/icons-vue'


// 定义响应式数据
const users = ref([])

// 获取所有用户信息
const getAllUser = async function () {
  let data = await userGetAllService();
  users.value = data.data;
}
getAllUser()


// 用户列表的数据模型
const userModel = ref({
  id: '',
  name: '',
  age: '',
  status: '',
  sex: '',
  address: '',
  phone: '',
  createTime: '',
  updateTime: ''
})

// 新增抽屉
const dialogVisibleAdd = ref(false)
// 修改抽屉
const dialogVisibleUpdate = ref(false)
// 查询弹窗
const dialogVisibleSelect = ref(false)


//清空模型数据
const clearuserModel = () => {
  userModel.value.name = '';
  userModel.value.age = '';
  userModel.value.status = '';
  userModel.value.sex = '';
  userModel.value.address = '';
  userModel.value.phone = '';
}


// 修改回显
const updateEcho = (row) => {
  dialogVisibleUpdate.value = true
  // 将row中的数据赋值给userModel
  userModel.value.name = row.name
  userModel.value.age = row.age
  userModel.value.status = row.status.toString(); // 转换状态为字符串
  userModel.value.sex = row.sex
  userModel.value.address = row.address
  userModel.value.phone = row.phone
  // 修改的时候必须传递用户的id，所以扩展一个id属性
  userModel.value.id = row.id
}

//分页条数据模型
const page = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(10)//每页条数

//条件分页查询的条件
const id = ref('')
const name = ref('')
const age = ref('')
const status = ref('')
const sex = ref('')
const address = ref('')
const phone = ref('')
const createTime = ref('')
const updateTime = ref('')

// 条件分页查询用户
const getUserByCondition = async () => {
  let params = {
    page: page.value,
    pageSize: pageSize.value,
    id: id.value ? id.value : null,
    name: name.value ? name.value : null,
    age: age.value ? age.value : null,
    status: status.value ? status.value : null,
    sex: sex.value ? sex.value : null,
    address: address.value ? address.value : null,
    phone: phone.value ? phone.value : null,
    createTime: createTime.value ? createTime.value : null,
    updateTime: updateTime.value ? updateTime.value : null
  }

  let result = await userSelectService(params)
  // 渲染列表数据
  users.value = result.data.rows

  // 渲染总条数
  total.value = result.data.total

  // 隐藏对话框
  dialogVisibleSelect.value = false
}
getUserByCondition()

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  getUserByCondition()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  page.value = num
  getUserByCondition()
}


import {ElMessage} from 'element-plus'

// 数据导出
const exportUser = () => {
  let result = userExportService();
  ElMessage.success(result.message ? result.message : '导出成功')
}

// 新增用户
const addUser = async () => {
  let result = await userAddService(userModel.value);
  ElMessage.success(result.message ? result.message : '新增成功')
  // 再次调用getAllUser，获取用户信息
  getAllUser()
  // 隐藏新增抽屉
  dialogVisibleAdd.value = false
}

// 修改用户
const updateUser = async () => {
  let result = await userUpdateService(userModel.value)
  ElMessage.success(result.message ? result.message : '修改成功')
  // 再次调用getAllUser，获取用户信息
  getAllUser()
  // 隐藏修改抽屉
  dialogVisibleUpdate.value = false
}

// 根据id删除用户
import {ElMessageBox} from 'element-plus'

const deleteUser = (row) => {
  ElMessageBox.confirm(
      '你确认删除该用户信息吗？',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //用户点击了确认
        let result = await userDeleteService(row.id)
        ElMessage.success(result.message ? result.message : '删除成功')
        //再次调用getAllUser()，获取所有用户
        getAllUser()
      })
      .catch(() => {
        //用户点击了取消
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

// 批量选中的数据
const tableChecked = ref([])

// 获取选中的值
const handleSelectionChange = (val) => {
  //console.log("handleSelectionChange--", val)
  tableChecked.value = val
}


// 根据id批量删除用户
const deleteByIdsUser = () => {
  ElMessageBox.confirm(
      '你确认删除选中的用户信息吗？',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        try {
          const idsToDelete = tableChecked.value.map(row => row.id);
          console.log(idsToDelete)
          let result = await userDeleteByIdsService(idsToDelete);
          ElMessage.success(result.message ? result.message : '删除成功');
          getAllUser();
        } catch (error) {
          console.error('删除失败:', error);
          ElMessage.error('删除失败');
        }
      })
      .catch(() => {
        ElMessage.info('取消删除');
      });
}

</script>


<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <h2><span>用户信息管理表</span></h2>
      </div>
      <!--功能按钮-->
      <div class="box">
        <el-button type="primary" :icon="Share" @click="exportUser()">数据导出</el-button>
        <el-button type="primary" :icon="Upload" @click="dialogVisibleAdd = true">新增用户</el-button>
        <el-button type="success" :icon="Search" @click="dialogVisibleSelect = true">查询用户</el-button>
        <el-button type="danger" :icon="Delete" :disabled="tableChecked.length === 0"
                   @click="deleteByIdsUser(tableChecked)">批量删除用户
        </el-button>
      </div>
    </template>

    <!-- 用户列表 -->
    <el-table :data="users" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="id" prop="id" width="70px"></el-table-column>
      <el-table-column label="用户姓名" prop="name" width="150px"></el-table-column>
      <el-table-column label="用户年龄" prop="age" width="130px"></el-table-column>
      <el-table-column label="状态" prop="status" width="100px">
        <template #default="{ row }">
          <span>{{ row.status === 1 ? '有效' : '无效' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex" width="100px"></el-table-column>
      <el-table-column label="地址" prop="address" width="150px"></el-table-column>
      <el-table-column label="用户电话" prop="phone" width="200px"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="updateEcho(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteUser(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>

    <!-- 条件查询弹框 -->
    <el-dialog v-model="dialogVisibleSelect" title="条件查询" width="40%">
      <el-form label-width="100px" style="padding-right: 30px">
        <el-form-item label="用户id">
          <el-input v-model="id" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="name" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="用户年龄">
          <el-input v-model="age" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="用户状态：">
          <el-select placeholder="请选择" v-model="status" style="width: 200px;">
            <el-option label="不选择" value=""></el-option>
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户性别">
          <el-select placeholder="请选择" v-model="sex" style="width: 200px;">
            <el-option label="不选择" value=""></el-option>
            <el-option label="男性" value="男"></el-option>
            <el-option label="女性" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户地址">
          <el-input v-model="address" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="用户电话">
          <el-input v-model="phone" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="createTime" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="修改时间">
          <el-input v-model="updateTime" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleSelect = false">取消</el-button>
                    <el-button type="primary" @click="getUserByCondition">确认</el-button>
                </span>
      </template>
    </el-dialog>

    <!-- 新增用户抽屉 -->
    <el-drawer v-model="dialogVisibleAdd" title="新增用户" direction="rtl" size="35%">
      <!-- 添加用户表单 -->
      <el-form :model="userModel" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="userModel.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="userModel.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="请选择" v-model="userModel.status">
            <el-option label="有效" value="1"/>
            <el-option label="无效" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select placeholder="请选择" v-model="userModel.sex">
            <el-option label="男" value="男"/>
            <el-option label="女" value="女"/>
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="userModel.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userModel.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addUser(); clearuserModel()">新增</el-button>
          <el-button type="info" @click="dialogVisibleAdd = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 修改用户抽屉 -->
    <el-drawer v-model="dialogVisibleUpdate" title="修改用户" direction="rtl" size="35%">
      <!-- 添加用户表单 -->
      <el-form :model="userModel" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="userModel.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="userModel.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="请选择" v-model="userModel.status">
            <el-option label="有效" value="1"/>
            <el-option label="无效" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select placeholder="请选择" v-model="userModel.sex">
            <el-option label="男" value="男"/>
            <el-option label="女" value="女"/>
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="userModel.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userModel.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateUser(); clearuserModel()">修改</el-button>
          <el-button type="info" @click="dialogVisibleUpdate = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 分页条 -->
    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
                   layout="jumper, total, sizes, prev, pager, next" background :total="total"
                   @size-change="onSizeChange"
                   @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end"/>

    <!-- 底部信息 -->
    <template #footer>CRUD ©2024 Created by XZY</template>
  </el-card>
</template>

<style scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h2 {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.box {
  transform: translateX(100%);
  /**右移元素**/
  -ms-transform: translateX(65%);
  -webkit-transform: translateX(75%);
}
</style>
