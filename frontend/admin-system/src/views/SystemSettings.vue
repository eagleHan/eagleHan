<template>
  <div class="system-settings">
    <h1 class="page-title">系统设置</h1>
    
    <el-row :gutter="20">
      <!-- 基本设置 -->
      <el-col :span="12">
        <el-card class="setting-card">
          <template #header>
            <div class="card-header">
              <el-icon><Setting /></el-icon>
              <span>基本设置</span>
            </div>
          </template>
          
          <el-form
            ref="basicFormRef"
            :model="basicForm"
            :rules="basicFormRules"
            label-width="120px"
          >
            <el-form-item label="系统名称" prop="systemName">
              <el-input v-model="basicForm.systemName" placeholder="请输入系统名称" />
            </el-form-item>
            
            <el-form-item label="系统描述" prop="systemDescription">
              <el-input
                v-model="basicForm.systemDescription"
                type="textarea"
                :rows="3"
                placeholder="请输入系统描述"
              />
            </el-form-item>
            
            <el-form-item label="系统版本" prop="systemVersion">
              <el-input v-model="basicForm.systemVersion" placeholder="请输入系统版本" />
            </el-form-item>
            
            <el-form-item label="维护模式" prop="maintenanceMode">
              <el-switch
                v-model="basicForm.maintenanceMode"
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleBasicSubmit" :loading="basicLoading">
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <!-- 安全设置 -->
      <el-col :span="12">
        <el-card class="setting-card">
          <template #header>
            <div class="card-header">
              <el-icon><Lock /></el-icon>
              <span>安全设置</span>
            </div>
          </template>
          
          <el-form
            ref="securityFormRef"
            :model="securityForm"
            :rules="securityFormRules"
            label-width="120px"
          >
            <el-form-item label="密码最小长度" prop="minPasswordLength">
              <el-input-number
                v-model="securityForm.minPasswordLength"
                :min="6"
                :max="20"
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="登录失败次数" prop="maxLoginAttempts">
              <el-input-number
                v-model="securityForm.maxLoginAttempts"
                :min="3"
                :max="10"
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="会话超时时间" prop="sessionTimeout">
              <el-select v-model="securityForm.sessionTimeout" style="width: 100%">
                <el-option label="30分钟" :value="30" />
                <el-option label="1小时" :value="60" />
                <el-option label="2小时" :value="120" />
                <el-option label="4小时" :value="240" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="强制HTTPS" prop="forceHttps">
              <el-switch
                v-model="securityForm.forceHttps"
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleSecuritySubmit" :loading="securityLoading">
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 邮件设置 -->
      <el-col :span="12">
        <el-card class="setting-card">
          <template #header>
            <div class="card-header">
              <el-icon><Message /></el-icon>
              <span>邮件设置</span>
            </div>
          </template>
          
          <el-form
            ref="emailFormRef"
            :model="emailForm"
            :rules="emailFormRules"
            label-width="120px"
          >
            <el-form-item label="SMTP服务器" prop="smtpHost">
              <el-input v-model="emailForm.smtpHost" placeholder="请输入SMTP服务器地址" />
            </el-form-item>
            
            <el-form-item label="SMTP端口" prop="smtpPort">
              <el-input-number
                v-model="emailForm.smtpPort"
                :min="1"
                :max="65535"
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="发件人邮箱" prop="fromEmail">
              <el-input v-model="emailForm.fromEmail" placeholder="请输入发件人邮箱" />
            </el-form-item>
            
            <el-form-item label="邮箱密码" prop="emailPassword">
              <el-input
                v-model="emailForm.emailPassword"
                type="password"
                placeholder="请输入邮箱密码"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="启用SSL" prop="enableSsl">
              <el-switch
                v-model="emailForm.enableSsl"
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleEmailSubmit" :loading="emailLoading">
                保存设置
              </el-button>
              <el-button @click="handleTestEmail" :loading="testEmailLoading">
                测试邮件
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <!-- 系统信息 -->
      <el-col :span="12">
        <el-card class="setting-card">
          <template #header>
            <div class="card-header">
              <el-icon><Monitor /></el-icon>
              <span>系统信息</span>
            </div>
          </template>
          
          <div class="system-info">
            <div class="info-item">
              <span class="info-label">服务器时间：</span>
              <span class="info-value">{{ currentTime }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">系统版本：</span>
              <span class="info-value">v1.0.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">数据库版本：</span>
              <span class="info-value">MySQL 8.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">运行时间：</span>
              <span class="info-value">15天 8小时 32分钟</span>
            </div>
            <div class="info-item">
              <span class="info-label">内存使用：</span>
              <span class="info-value">2.1GB / 8GB</span>
            </div>
            <div class="info-item">
              <span class="info-label">磁盘使用：</span>
              <span class="info-value">45.2GB / 100GB</span>
            </div>
          </div>
          
          <div class="system-actions">
            <el-button type="warning" @click="handleClearCache">
              <el-icon><Delete /></el-icon>
              清理缓存
            </el-button>
            <el-button type="info" @click="handleExportLogs">
              <el-icon><Download /></el-icon>
              导出日志
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

// 响应式数据
const basicFormRef = ref<FormInstance>()
const securityFormRef = ref<FormInstance>()
const emailFormRef = ref<FormInstance>()

const basicLoading = ref(false)
const securityLoading = ref(false)
const emailLoading = ref(false)
const testEmailLoading = ref(false)

const currentTime = ref('')
let timeInterval: NodeJS.Timeout

// 表单数据
const basicForm = reactive({
  systemName: '后台管理系统',
  systemDescription: '基于Vue3和Element Plus的现代化后台管理系统',
  systemVersion: 'v1.0.0',
  maintenanceMode: false
})

const securityForm = reactive({
  minPasswordLength: 8,
  maxLoginAttempts: 5,
  sessionTimeout: 60,
  forceHttps: false
})

const emailForm = reactive({
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  fromEmail: 'admin@example.com',
  emailPassword: '',
  enableSsl: true
})

// 表单验证规则
const basicFormRules: FormRules = {
  systemName: [
    { required: true, message: '请输入系统名称', trigger: 'blur' }
  ],
  systemDescription: [
    { required: true, message: '请输入系统描述', trigger: 'blur' }
  ],
  systemVersion: [
    { required: true, message: '请输入系统版本', trigger: 'blur' }
  ]
}

const securityFormRules: FormRules = {
  minPasswordLength: [
    { required: true, message: '请设置密码最小长度', trigger: 'blur' }
  ],
  maxLoginAttempts: [
    { required: true, message: '请设置登录失败次数', trigger: 'blur' }
  ],
  sessionTimeout: [
    { required: true, message: '请设置会话超时时间', trigger: 'change' }
  ]
}

const emailFormRules: FormRules = {
  smtpHost: [
    { required: true, message: '请输入SMTP服务器地址', trigger: 'blur' }
  ],
  smtpPort: [
    { required: true, message: '请输入SMTP端口', trigger: 'blur' }
  ],
  fromEmail: [
    { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 方法
const updateCurrentTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN')
}

const handleBasicSubmit = async () => {
  if (!basicFormRef.value) return
  
  try {
    await basicFormRef.value.validate()
    basicLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('基本设置保存成功')
  } catch (error) {
    console.error('Basic settings submit failed:', error)
  } finally {
    basicLoading.value = false
  }
}

const handleSecuritySubmit = async () => {
  if (!securityFormRef.value) return
  
  try {
    await securityFormRef.value.validate()
    securityLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('安全设置保存成功')
  } catch (error) {
    console.error('Security settings submit failed:', error)
  } finally {
    securityLoading.value = false
  }
}

const handleEmailSubmit = async () => {
  if (!emailFormRef.value) return
  
  try {
    await emailFormRef.value.validate()
    emailLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('邮件设置保存成功')
  } catch (error) {
    console.error('Email settings submit failed:', error)
  } finally {
    emailLoading.value = false
  }
}

const handleTestEmail = async () => {
  testEmailLoading.value = true
  
  try {
    // 模拟发送测试邮件
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('测试邮件发送成功')
  } catch (error) {
    ElMessage.error('测试邮件发送失败')
  } finally {
    testEmailLoading.value = false
  }
}

const handleClearCache = async () => {
  try {
    // 模拟清理缓存
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('缓存清理成功')
  } catch (error) {
    ElMessage.error('缓存清理失败')
  }
}

const handleExportLogs = () => {
  ElMessage.info('日志导出功能开发中...')
}

// 生命周期
onMounted(() => {
  updateCurrentTime()
  timeInterval = setInterval(updateCurrentTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.system-settings {
  padding: 0;
}

.page-title {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.setting-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.card-header .el-icon {
  margin-right: 8px;
  font-size: 18px;
}

.system-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: #606266;
}

.info-value {
  color: #303133;
}

.system-actions {
  display: flex;
  gap: 10px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>