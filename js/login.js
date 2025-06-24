// js/login.js
// 简单表单验证示例
document.getElementById('loginForm').onsubmit = function (e) {
    var user = this.username.value.trim();
    var pass = this.password.value.trim();
    if (!user || !pass) {
        alert('用户名和密码不能为空！');
        e.preventDefault();
    }
};

document.getElementById('registerForm').onsubmit = function (e) {
    var user = this.reg_username.value.trim();
    var email = this.reg_email.value.trim();
    var pass = this.reg_password.value.trim();
    if (!user || !email || !pass) {
        alert('所有字段都不能为空！');
        e.preventDefault();
    } else if (!email.match(/^[\w\-\.]+@[\w\-\.]+\.\w+$/)) {
        alert('邮箱格式不正确！');
        e.preventDefault();
    }
};
