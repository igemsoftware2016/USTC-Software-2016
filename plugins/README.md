# plugins README  
  
## simulation  
input of the simulaiton should contain 3 parts  
1. coefficient  
2. equations (dy/dt = ....)  
3. initial values  
  
there is a example_input of simlulation:  
1. coefficient(string)  
```python
str_coefs="start_t=0;end_t=200;step=0.005;"
```
2. equations(string)  
```python
str_eqs ="""# equations (one equation one line)
    dy0dt = 0.01*y[0] +0.005*y[1]
    dy1dt = 0.05*y[1]*(1-y[1]/2)
    # end line """

```  
the number of equations should the same as variables to make sure the ODE can be solved
3. init values(string)  
str_init = """# init values
    y0 = 0.2
    y1 = 0.1
    # end line"""