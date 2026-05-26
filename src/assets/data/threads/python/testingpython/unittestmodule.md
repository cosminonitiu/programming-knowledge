## `unittest` Module
---

`unittest` is Python's built-in testing framework, modelled after JUnit. It provides test discovery, test runners, assertion methods, and test lifecycle hooks without any additional dependencies.

---

## 1. Basic Test Structure

```python
import unittest

class Calculator:
    def add(self, a, b): return a + b
    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b

class TestCalculator(unittest.TestCase):
    def setUp(self):
        """Run before each test method."""
        self.calc = Calculator()

    def tearDown(self):
        """Run after each test method."""
        pass

    def test_add(self):
        result = self.calc.add(2, 3)
        self.assertEqual(result, 5)

    def test_add_negative(self):
        self.assertEqual(self.calc.add(-1, -2), -3)

    def test_divide_by_zero(self):
        with self.assertRaises(ValueError) as ctx:
            self.calc.divide(10, 0)
        self.assertIn("zero", str(ctx.exception))

if __name__ == "__main__":
    unittest.main()
```

---

## 2. All Assertion Methods

```python
# Equality / identity
self.assertEqual(a, b)
self.assertNotEqual(a, b)
self.assertIs(a, b)           # a is b
self.assertIsNot(a, b)
self.assertIsNone(x)
self.assertIsNotNone(x)

# Boolean
self.assertTrue(expr)
self.assertFalse(expr)

# Membership
self.assertIn(member, container)
self.assertNotIn(member, container)

# Type
self.assertIsInstance(obj, cls)
self.assertNotIsInstance(obj, cls)

# Exceptions
self.assertRaises(ExcType, callable, *args)
with self.assertRaises(ExcType): ...
self.assertRaisesRegex(ExcType, regex, callable, *args)

# Numeric
self.assertAlmostEqual(a, b, places=7)
self.assertGreater(a, b)
self.assertGreaterEqual(a, b)
self.assertLess(a, b)
self.assertLessEqual(a, b)

# Sequences / dicts
self.assertListEqual(list1, list2)
self.assertDictEqual(dict1, dict2)
self.assertSetEqual(set1, set2)
self.assertSequenceEqual(seq1, seq2)

# String
self.assertRegex(text, pattern)
self.assertMultiLineEqual(str1, str2)
```

---

## 3. Test Lifecycle Hooks

```python
class TestWithLifecycle(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Run once before any test in this class."""
        cls.db = create_test_database()

    @classmethod
    def tearDownClass(cls):
        """Run once after all tests in this class."""
        cls.db.destroy()

    def setUp(self):
        """Run before each test method."""
        self.db.begin_transaction()

    def tearDown(self):
        """Run after each test method (even if it failed)."""
        self.db.rollback()
```

---

## 4. Skipping and Expected Failures

```python
class TestFeatures(unittest.TestCase):

    @unittest.skip("Not implemented yet")
    def test_future_feature(self):
        ...

    @unittest.skipIf(sys.platform == "win32", "Does not run on Windows")
    def test_unix_only(self):
        ...

    @unittest.skipUnless(os.environ.get("INTEGRATION"), "Set INTEGRATION=1")
    def test_integration(self):
        ...

    @unittest.expectedFailure
    def test_known_bug(self):
        self.assertEqual(1, 2)   # marked as expected failure, not error
```

---

## 5. Test Discovery and Running

```bash
# Run all tests in current directory (discovers test_*.py files)
python -m unittest discover

# Run a specific module
python -m unittest test_calculator

# Run a specific test class
python -m unittest test_calculator.TestCalculator

# Run a specific test
python -m unittest test_calculator.TestCalculator.test_add

# Verbose output
python -m unittest -v discover
```

---

## 6. `unittest.mock` — Basic Mocking

```python
from unittest.mock import MagicMock, patch

# Create a mock
mock_service = MagicMock()
mock_service.get_user.return_value = {"id": 1, "name": "Alice"}
mock_service.save.return_value = True

result = mock_service.get_user(1)
mock_service.get_user.assert_called_once_with(1)

# patch as context manager
with patch("mymodule.requests.get") as mock_get:
    mock_get.return_value.json.return_value = {"status": "ok"}
    result = call_api("https://example.com/api")

mock_get.assert_called_once()
```

---

## 7. Subtests — Multiple Cases in One Test

```python
class TestDivision(unittest.TestCase):
    def test_many_inputs(self):
        cases = [(10, 2, 5.0), (9, 3, 3.0), (7, 2, 3.5)]
        for a, b, expected in cases:
            with self.subTest(a=a, b=b):
                self.assertAlmostEqual(a / b, expected)
                # If one subtest fails, others still run
```
