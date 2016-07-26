import os
import unittest2 as unittest

def suite():
    return unittest.TestLoader().discover('tests','test_*.py')

if __name__ == '__main__':
    unittest.main(defaultTest = 'suite')