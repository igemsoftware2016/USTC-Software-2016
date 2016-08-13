# Pano Document
## Data
数据格式编程json格式 有两个变量域 nodes(节点信息) linkes(有向连接关系) 示例数据：  
```
{
  "nodes":[
    {"id":0  ,"type":3, "u_name":"gene1", "x":300,  "y":300},
    {"id":1  ,"type":3, "u_name":"gene2", "x":330,  "y":300},
    {"id":2  ,"type":3, "u_name":"gene3", "x":360,  "y":300},
  ]
,
"links":[
  {"lid":0,  "source":1  ,"target":8  ,"weight":1},
  {"lid":0,  "source":2  ,"target":8  ,"weight":1}
]
}
```

## variable  
r_click_gene (global)   表示邮件刚点过的点的信息，在on("contextmenu",function..)中被赋值，也就是右键node的时候会给这个全局变量赋值。这个变量包含点的位置和id以及type等信息可以在自定义右键的弹出菜单中使用 
  
## Function  
#### redraw_lines(uid_num)   
uid_num:接受的变量是一个数字字符串，代表一个节点的id  
功能：查询和点相连的线并更新线的位置使点之间的连线随着端点改变而改变  
  
#### print_gra(data_graph)  
data_graph:像示例数据一样的完整数据，包含节点和连线数据  
功能:根据json画出图片上的点，之所以独立出来一个函数是为了后边更新svg方便  
  
#### about_modal()  
不接收参数  
只负责弹出和渲染 【about this gene】页面  
  
#### get_link_by_uid(uid_num)  
uid_num:接受的变量是一个数字字符串，代表一个节点的id    
功能：查询和点相连的点，返回一个json，包含node_in和node_out两个字段，分别是发出指向这个点向量的node和这个点发出的向量指向的node  
  
#### back_to_center(data_graph)  
通过考察data_graph里的点的位置信息，让图像回到点聚集的地方  

#### get_xy_range(json_data)
给出点分布的区域为 back_to_center提供参考
  
## attention  
node上的标签是对应node的id  
pano上的自定义右键只有node上的第一个可以用

