# User interface
##  登陆页面  
form:登陆名（邮箱）  密码  
##  注册页面  
form:用户名（昵称） 登录名（邮箱） 密码

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


## 所用到的轮子
D3.js  v3  
material.min.css    v1.1.3  
materialize         0.97.7  


## 接口文档
### plugin:user_module
用户模型-属性
face:base64  
name:str  
email:str(key)
education:str
major:str
description:str

用户模型-url post
#### 登陆  
post_url:/plugin  
json:[{"plugin":"user_model"},{"action":"validate_login"},{"data":formData}]
#### 注册  
post_url:/plugin  
json:[{"plugin":"user_model"},{"action":"create_user"},{"data":formData}]
#### 个人信息  
post_url:/plugin  
json:[{"plugin":"user_model"},{"action":"get_profile"},{"data":user_id}]  
#### 修改个人信息  
post_url:/plugin  
json:[{"plugin":"user_model"},{"action":"edit_profile"},{"data":profile_form}]  
### 修改头像
post_url:/plugin  
json:[{"plugin":"user_model"},{"action":"head_change"},{"data":base64 image}]  

