'''
Potential exceptions:
Invoke construct function: 
    ParameterMissedError(Initial values don't match equations)
Invoke simulation:
    NameError(User use wrong variable name witch cannot be parsed)
    ZeroDivisionError()
    ValueError(Initial value cannot be converted to float number)
'''
import numpy as np
from matplotlib import pyplot as plt
from scipy.integrate import odeint
from plugin import Plugin


class ParameterMissedError(Exception):
    pass


class bio_simulation:
    def __init__(self, str_eqs, str_init, start_t=0, end_t=1, step_l=0.002):
        # Clean all white space in input strings
        str_eqs = str_eqs.replace(' ','')
        str_eqs = str_eqs.replace('\t','')
        str_init = str_init.replace(' ','')
        str_init = str_init.replace('\t','')

        # Divide strings for parsing
        self.eqs_arr = str.split(str_eqs, '\n')
        self.init_arr = str.split(str_init, '\n')

        # Intial values and equations don't match
        if len(self.eqs_arr) != len(self.init_arr):
            raise ParameterMissedError

        self.start_t = start_t
        self.end_t = end_t
        self.step_l = step_l


    def func(self, ys, t, eqs_arr):
        # Make a deep copy of eqs_arr
        eqs = list(eqs_arr)

        # Replace all variable to do eval()
        for i in range(len(eqs)):
            for j in range(len(eqs)):
                eqs[i] = eqs[i].replace('y['+str(j)+']', str(ys[j]));

        try:
            #Calculate expressions and return a list
            dydt = list(map(eval, eqs))
        except NameError as e: # Invalid variable name
            print(e)
            exit(-1)
        except ZeroDivisionError as e:
            print(e)
            exit(-1)

        return dydt


    def run_sim(self):
        self.t_range = np.linspace(self.start_t, self.end_t, ((self.end_t - self.start_t) / self.step_l))
        
        # Get initial values
        y0 = []
        for init_single_line in self.init_arr:
            parse_init = str.split(init_single_line, '=')[1]
            try:
                y0.append(float(parse_init))
            except ValueError as e:
                print(e)
                exit(-1)
        
        # I recommend to modify interface to remove the follwing 2 lines.
        for i in range(len(self.eqs_arr)):
            self.eqs_arr[i] = self.eqs_arr[i].split('=')[1]

        # Solve DE system, for information about how to use odeint, please follow this link below:
        # http://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.odeint.html
        # self.data_all is a numpy.ndarray
        self.data_all = odeint(self.func, y0, self.t_range, args=(self.eqs_arr,)).transpose()
        return 0


    def parse_data(self):
        return self.data_all


    def plot_data(self):
        for i in range(self.data_all.shape[0]):
            plt.plot(self.t_range, self.data_all[i, :], label='y'+str(i))
        plt.show()

'''
def main():
    str_eqs ="""dy0dt = 0.01*y[0] +0.005*y[1]
    dy1dt = 0.05*y[1]*(1-y[1]/2)
    dy2dt = 0.02"""
    str_init = """y0 = 0.2
    y1 = 0.1
    y2 = 0.2"""
    sim = bio_simulation(str_eqs, str_init)
    sim.run_sim()
    print(repr(list(map(list, sim.data_all))))
    sim.plot_data()
if __name__ in ("plugins.simulation", '__main__'):
    main()
'''


class Simulation(Plugin):
    name = 'simulation'

    def process(self, request):
        str_eqs = request['eqs']
        str_init = request['init']

        # !===Plugin manager should implement the exception handling below===!
        try:
            sim = bio_simulation(str_eqs, str_init)
            sim.run_sim()
        except ParameterMissedError:
            pass # For implementation
        except NameError:
            pass # For implementation
        except ZeroDivisionError:
            pass # For implementation
        except ValueError:
            pass # For implementation

        # May be you should modify this line below to satify your interface
        return dict(result=repr(list(map(list, sim.data_all))))


__plugin__ = Simulation()
