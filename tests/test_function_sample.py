from test_sample.function_as_sample import multiply,add_and_multiply
import unittest
import mock
'''

'''
class TestFunctions(unittest.TestCase):
    # replace the function:multiply that we import
    # if not decorated,the function imported is used
    @mock.patch('test_sample.function_as_sample.multiply')
    def test_add_and_multiply(self,mock_multiply):

        x = 3
        y = 5
        mock_multiply.return_value = 15

        addition, multiple = add_and_multiply(x, y)
        mock_multiply.assert_called_once_with(3, 5)

        self.assertEqual(8, addition)
        self.assertEqual(15, multiple)

if __name__ == '__main__':
    unittest.main()
