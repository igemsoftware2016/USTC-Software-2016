#!/usr/bin/env python3
'''
    Setup all tests files and run pylint
'''
import unittest
import subprocess
from pylint import epylint as lint

DIR_LIST=[
    'plugins',
    'models'
]

test='123'
def suite():
    return unittest.TestLoader().discover('tests','test_*.py')

if __name__ == '__main__':
    unittest.main(defaultTest = 'suite')
    # subprocess.call(['pylint','-rn','set_up.py'])
    # (pylint_stdout,pylint_stderr)=lint.py_run('test_sample/MyDict.py',return_std=True)
    # result_string=pylint_stdout.getvalue()
    # print(result_string)