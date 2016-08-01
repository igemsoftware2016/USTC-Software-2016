# User interface
##  登陆页面
输入完用户名和密码之后按下signin或者敲Enter会给/validateLogin post 一个表单
##  注册页面
post的目标url是 /signup


## error code:
### （登陆）
a1:账号或密码错误  
### （注册）
b1:账号已经注册  

## 调试
debug-fake-backend 是调试用的伪后端，flask写的，模拟后端接受post做客户验证并返回信息，前端可以根据自己的需要来定制自己的url响应内容，注意不要冲突，当前有的登陆和注册的url  
  
eg:  
在登陆不成功的时候返回  
```
{'error','a1'}
```