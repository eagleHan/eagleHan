<template>
  <div class="user-management">
    <h1 class="page-title">用户管理</h1>
    
    <!-- 搜索和操作栏 -->
    <el-card class="search-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="searchForm.email"
            placeholder="请输入邮箱"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-col>
        <el-col :span="6" class="text-right">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增用户
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    
    <!-- 用户表格 -->
    <el-card class="table-card">
      <el-table
        :data="userList"
        :loading="loading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="roles" label="角色" width="150">
          <template #default="{ row }">
            <el-tag
              v-for="role in row.roles"
              :key="role"
              size="small"
              class="role-tag"
            >
              {{ role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'active' ? 'success' : 'danger'"
              size="small"
            >
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              :type="row.status === 'active' ? 'warning' : 'success'"
              size="small"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select
            v-model="userForm.roles"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option label="管理员" value="admin" />
            <el-option label="编辑者" value="editor" />
            <el-option label="查看者" value="viewer" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import type { UserItem, UserListParams, CreateUserParams, UpdateUserParams } from '@/api/user'

// 响应式数据
const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const userFormRef = ref<FormInstance>()

const searchForm = reactive({
  username: '',
  email: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const userList = ref<UserItem[]>([])

const userForm = reactive<CreateUserParams & { id?: number }>({
  username: '',
  email: '',
  password: '',
  roles: []
})

const userFormRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  roles: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 模拟数据
const mockUsers: UserItem[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    roles: ['admin'],
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    username: 'editor',
    email: 'editor@example.com',
    roles: ['editor'],
    status: 'active',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  },
  {
    id: 3,
    username: 'viewer',
    email: 'viewer@example.com',
    roles: ['viewer'],
    status: 'inactive',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z'
  }
]

// 方法
const fetchUserList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 过滤数据
    let filteredUsers = mockUsers
    if (searchForm.username) {
      filteredUsers = filteredUsers.filter(user => 
        user.username.includes(searchForm.username)
      )
    }
    if (searchForm.email) {
      filteredUsers = filteredUsers.filter(user => 
        user.email.includes(searchForm.email)
      )
    }
    
    // 分页
    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    userList.value = filteredUsers.slice(start, end)
    pagination.total = filteredUsers.length
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchUserList()
}

const handleReset = () => {
  searchForm.username = ''
  searchForm.email = ''
  pagination.page = 1
  fetchUserList()
}

const handleAdd = () => {
  isEdit.value = false
  dialogVisible.value = true
  resetForm()
}

const handleEdit = (row: UserItem) => {
  isEdit.value = true
  dialogVisible.value = true
  Object.assign(userForm, {
    id: row.id,
    username: row.username,
    email: row.email,
    roles: [...row.roles]
  })
}

const handleToggleStatus = async (row: UserItem) => {
  try {
    const action = row.status === 'active' ? '禁用' : '启用'
    await ElMessageBox.confirm(`确定要${action}用户 ${row.username} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    row.status = row.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`${action}成功`)
  } catch {
    // 用户取消
  }
}

const handleDelete = async (row: UserItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 ${row.username} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success('删除成功')
    fetchUserList()
  } catch {
    // 用户取消
  }
}

const handleSubmit = async () => {
  if (!userFormRef.value) return
  
  try {
    await userFormRef.value.validate()
    submitLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    dialogVisible.value = false
    fetchUserList()
  } catch (error) {
    console.error('Submit failed:', error)
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  resetForm()
  userFormRef.value?.clearValidate()
}

const resetForm = () => {
  Object.assign(userForm, {
    id: undefined,
    username: '',
    email: '',
    password: '',
    roles: []
  })
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchUserList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchUserList()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 生命周期
onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.user-management {
  padding: 0;
}

.page-title {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.text-right {
  text-align: right;
}

.role-tag {
  margin-right: 5px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>