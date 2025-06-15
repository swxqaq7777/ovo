<template>
    <view class="auth-container">
        <view class="auth-header">
            <text class="auth-title">{{ isLogin ? '欢迎回来' : '注册新账号' }}</text>
        </view>

        <view class="auth-form">
            <view class="form-item">
                <text class="form-label">用户名</text>
                <input class="form-input" v-model="form.username" placeholder="请输入用户名" maxlength="20" />
            </view>

            <view class="form-item">
                <text class="form-label">密码</text>
                <input class="form-input" v-model="form.password" placeholder="请输入密码" password maxlength="20" />
            </view>

            <view class="form-item" v-if="!isLogin">
                <text class="form-label">确认密码</text>
                <input class="form-input" v-model="form.confirmPassword" placeholder="请再次输入密码" password
                    maxlength="20" />
            </view>

            <button class="btn-submit" @click="handleSubmit">
                {{ isLogin ? '登录' : '注册' }}
            </button>

            <view class="auth-switch">
                <text @click="toggleAuthMode">
                    {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
                </text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            isLogin: true,
            form: {
                username: '',
                password: '',
                confirmPassword: ''
            }
        };
    },
    methods: {
        toggleAuthMode() {
            this.isLogin = !this.isLogin;
            this.form = {
                username: '',
                password: '',
                confirmPassword: ''
            };
        },
        handleSubmit() {
            if (!this.form.username.trim()) {
                uni.showToast({ title: '请输入用户名', icon: 'none' });
                return;
            }

            if (!this.form.password.trim()) {
                uni.showToast({ title: '请输入密码', icon: 'none' });
                return;
            }

            if (!this.isLogin && this.form.password !== this.form.confirmPassword) {
                uni.showToast({ title: '两次密码不一致', icon: 'none' });
                return;
            }

            // 模拟登录/注册成功
            if (this.isLogin) {
                // 登录逻辑
                uni.showLoading({ title: '登录中...' });
                setTimeout(() => {
                    uni.hideLoading();
                    // 保存用户信息到本地
                    uni.setStorageSync('user_info', {
                        username: this.form.username,
                        avatar: '../../static/default-avatar.png'
                    });
                    uni.showToast({ title: '登录成功', icon: 'success' });
                    // 返回上一页或跳转到首页
                    uni.switchTab({
                        url: '/pages/tabbar/index/index'
                    });
                }, 1500);
            } else {
                // 注册逻辑
                uni.showLoading({ title: '注册中...' });
                setTimeout(() => {
                    uni.hideLoading();
                    // 保存用户信息到本地
                    uni.setStorageSync('user_info', {
                        username: this.form.username,
                        avatar: '../../static/default-avatar.png'
                    });
                    uni.showToast({ title: '注册成功', icon: 'success' });
                    // 自动切换到登录状态
                    this.isLogin = true;
                }, 1500);
            }
        }
    }
};
</script>

<style scoped>
.auth-container {
    padding: 60rpx 40rpx;
    min-height: 100vh;
    background: #f5f5f5;
}

.auth-header {
    margin-bottom: 60rpx;
    text-align: center;
}

.auth-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
}

.auth-form {
    background: white;
    padding: 40rpx;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.form-item {
    margin-bottom: 40rpx;
}

.form-label {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 16rpx;
    display: block;
}

.form-input {
    width: 100%;
    height: 80rpx;
    padding: 0 20rpx;
    border: 1rpx solid #ddd;
    border-radius: 8rpx;
    font-size: 26rpx;
    box-sizing: border-box;
}

.btn-submit {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    background: #007aff;
    color: white;
    font-size: 28rpx;
    border-radius: 45rpx;
    margin-top: 20rpx;
}

.auth-switch {
    margin-top: 40rpx;
    text-align: center;
    font-size: 24rpx;
    color: #007aff;
}

.auth-switch text {
    text-decoration: underline;
}
</style>
