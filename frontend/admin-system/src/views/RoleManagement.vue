<template>
  <div class="role-management">
    <h1 class="page-title">角色管理</h1>
    
    <!-- 操作栏 -->
    <el-card class="action-card">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增角色
      </el-button>
    </el-card>
    
    <!-- 角色表格 -->
    <el-card class="table-card">
      <el-table
        :data="roleList"
        :loading="loading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="permissions" label="权限" width="300">
          <template #default="{ row }">
            <el-tag
              v-for="permission in row.permissions"
              :key="permission"
              size="small"
              class="permission-tag"
            >
              {{ getPermissionLabel(permission) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
              :disabled="row.name === 'admin'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑角色' : '新增角色'"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-tree
            ref="permissionTreeRef"
            :data="permissionTree"
            :props="treeProps"
            show-checkbox
            node-key="value"
            :default-checked-keys="roleForm.permissions"
            @check="handlePermissionCheck"
          />
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

interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

interface Permission {
  label: string
  value: string
  children?: Permission[]
}

// 响应式数据
const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const roleFormRef = ref<FormInstance>()
const permissionTreeRef = ref()

const roleList = ref<Role[]>([])

const roleForm = reactive({
  id: undefined as number | undefined,
  name: '',
  description: '',
  permissions: [] as string[]
})

const roleFormRules: FormRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '角色名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入角色描述', trigger: 'blur' }
  ],
  permissions: [
    { required: true, message: '请选择权限', trigger: 'change' }
  ]
}

const treeProps = {
  children: 'children',
  label: 'label'
}

// 权限树数据
const permissionTree: Permission[] = [
  {
    label: '用户管理',
    value: 'user',
    children: [
      { label: '查看用户', value: 'user:view' },
      { label: '创建用户', value: 'user:create' },
      { label: '编辑用户', value: 'user:edit' },
      { label: '删除用户', value: 'user:delete' }
    ]
  },
  {
    label: '角色管理',
    value: 'role',
    children: [
      { label: '查看角色', value: 'role:view' },
      { label: '创建角色', value: 'role:create' },
      { label: '编辑角色', value: 'role:edit' },
      { label: '删除角色', value: 'role:delete' }
    ]
  },
  {
    label: '系统设置',
    value: 'system',
    children: [
      { label: '查看设置', value: 'system:view' },
      { label: '修改设置', value: 'system:edit' }
    ]
  }
]

// 权限标签映射
const permissionLabels: Record<string, string> = {
  'user:view': '查看用户',
  'user:create': '创建用户',
  'user:edit': '编辑用户',
  'user:delete': '删除用户',
  'role:view': '查看角色',
  'role:create': '创建角色',
  'role:edit': '编辑角色',
  'role:delete': '删除角色',
  'system:view': '查看设置',
  'system:edit': '修改设置'
}

// 模拟数据
const mockRoles: Role[] = [
  {
    id: 1,
    name: 'admin',
    description: '系统管理员，拥有所有权限',
    permissions: ['user:view', 'user:create', 'user:edit', 'user:delete', 'role:view', 'role:create', 'role:edit', 'role:delete', 'system:view', 'system:edit'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'editor',
    description: '编辑者，可以管理用户但不能管理角色',
    permissions: ['user:view', 'user:create', 'user:edit', 'role:view'],
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: 'viewer',
    description: '查看者，只能查看信息',
    permissions: ['user:view', 'role:view', 'system:view'],
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z'
  }
]

// 方法
const fetchRoleList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    roleList.value = [...mockRoles]
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  dialogVisible.value = true
  resetForm()
}

const handleEdit = (row: Role) => {
  isEdit.value = true
  dialogVisible.value = true
  Object.assign(roleForm, {
    id: row.id,
    name: row.name,
    description: row.description,
    permissions: [...row.permissions]
  })
  
  // 设置权限树选中状态
  setTimeout(() => {
    permissionTreeRef.value?.setCheckedKeys(row.permissions)
  }, 100)
}

const handleDelete = async (row: Role) => {
  try {
    await ElMessageBox.confirm(`确定要删除角色 ${row.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success('删除成功')
    fetchRoleList()
  } catch {
    // 用户取消
  }
}

const handleSubmit = async () => {
  if (!roleFormRef.value) return
  
  try {
    await roleFormRef.value.validate()
    
    if (roleForm.permissions.length === 0) {
      ElMessage.error('请选择至少一个权限')
      return
    }
    
    submitLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    dialogVisible.value = false
    fetchRoleList()
  } catch (error) {
    console.error('Submit failed:', error)
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  resetForm()
  roleFormRef.value?.clearValidate()
  permissionTreeRef.value?.setCheckedKeys([])
}

const resetForm = () => {
  Object.assign(roleForm, {
    id: undefined,
    name: '',
    description: '',
    permissions: []
  })
}

const handlePermissionCheck = () => {
  const checkedKeys = permissionTreeRef.value?.getCheckedKeys() || []
  const halfCheckedKeys = permissionTreeRef.value?.getHalfCheckedKeys() || []
  roleForm.permissions = [...checkedKeys, ...halfCheckedKeys]
}

const getPermissionLabel = (permission: string) => {
  return permissionLabels[permission] || permission
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 生命周期
onMounted(() => {
  fetchRoleList()
})
</script>

<style scoped>
.role-management {
  padding: 0;
}

.page-title {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.action-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.permission-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-tree) {
  max-height: 300px;
  overflow-y: auto;
}
</style>