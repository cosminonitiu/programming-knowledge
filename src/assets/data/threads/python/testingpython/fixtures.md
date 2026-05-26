## Fixtures and Parametrize
---

Fixtures are pytest's dependency injection system. They provide test functions with resources (database connections, temporary files, mock objects) with automatic setup and teardown, and can be shared across tests via scoping.

---

## 1. Basic Fixtures

```python
import pytest

@pytest.fixture
def sample_user():
    return {"id": 1, "name": "Alice", "email": "alice@example.com"}

def test_user_name(sample_user):
    assert sample_user["name"] == "Alice"

def test_user_email(sample_user):
    assert "@" in sample_user["email"]
```

---

## 2. Fixtures with Setup and Teardown

Use `yield` to run teardown code after the test:

```python
@pytest.fixture
def database():
    """Set up test database, yield it, then clean up."""
    db = TestDatabase()
    db.connect()
    db.create_tables()
    yield db               # test runs here
    db.rollback()          # teardown
    db.close()

def test_insert_user(database):
    database.insert("users", {"name": "Bob"})
    result = database.query("SELECT * FROM users")
    assert len(result) == 1
```

---

## 3. Fixture Scope

Controls how often the fixture is created:

```python
@pytest.fixture(scope="function")  # default — once per test function
def fresh_client():
    return TestClient()

@pytest.fixture(scope="class")     # once per test class
def db_session():
    ...

@pytest.fixture(scope="module")    # once per test module (.py file)
def heavy_model():
    model = load_ml_model()        # expensive — only loaded once
    yield model

@pytest.fixture(scope="session")   # once for the entire test suite
def app():
    app = create_flask_app(testing=True)
    yield app
```

---

## 4. Fixture Dependency Injection

Fixtures can use other fixtures:

```python
@pytest.fixture(scope="session")
def app():
    return create_app(testing=True)

@pytest.fixture(scope="session")
def db(app):
    with app.app_context():
        init_db()
        yield get_db()
        drop_db()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_client(client, sample_user):
    """Authenticated test client — depends on client and user."""
    client.post("/login", json={"email": sample_user["email"], "password": "test"})
    return client
```

---

## 5. `autouse` Fixtures

Automatically applied to all tests without explicit request:

```python
@pytest.fixture(autouse=True)
def reset_database(database):
    """Auto-rollback all tests — no test can pollute the next."""
    yield
    database.rollback()

@pytest.fixture(autouse=True)
def mock_env_vars(monkeypatch):
    monkeypatch.setenv("ENVIRONMENT", "testing")
    monkeypatch.setenv("DATABASE_URL", "sqlite:///:memory:")
```

---

## 6. `@pytest.mark.parametrize` — Multiple Inputs

```python
@pytest.mark.parametrize("input,expected", [
    ("hello", "HELLO"),
    ("world", "WORLD"),
    ("", ""),
    ("ALREADY_UPPER", "ALREADY_UPPER"),
])
def test_to_upper(input, expected):
    assert input.upper() == expected
```

---

## 7. Parametrize with Fixtures

```python
@pytest.fixture(params=["sqlite", "postgres"])
def db_connection(request):
    """Parametrised fixture — tests run once per param."""
    if request.param == "sqlite":
        yield create_sqlite_connection()
    else:
        yield create_postgres_connection()

def test_query_users(db_connection):
    # this test runs twice — once for sqlite, once for postgres
    result = db_connection.execute("SELECT 1")
    assert result is not None
```

---

## 8. Indirect Parametrize

```python
@pytest.fixture
def user_role(request):
    """Fixture parametrised indirectly from test."""
    role = request.param
    return create_user(role=role)

@pytest.mark.parametrize("user_role", ["admin", "viewer", "editor"], indirect=True)
def test_dashboard_access(user_role):
    # user_role fixture is called with each param
    response = get_dashboard(user=user_role)
    assert response.status_code == 200
```

---

## 9. `tmp_path` and `tmp_path_factory` — Built-in Fixtures

```python
def test_file_creation(tmp_path):
    """tmp_path is a pathlib.Path to a temporary directory."""
    file = tmp_path / "output.txt"
    file.write_text("hello")
    assert file.read_text() == "hello"
    # directory is automatically deleted after test

@pytest.fixture(scope="session")
def shared_datadir(tmp_path_factory):
    base = tmp_path_factory.mktemp("data")
    (base / "config.json").write_text('{"key": "value"}')
    return base
```

---

## 10. `request` Fixture — Introspect the Test Context

```python
@pytest.fixture
def configured_resource(request):
    marker = request.node.get_closest_marker("config")
    config = marker.args[0] if marker else {}
    resource = create_resource(**config)
    yield resource

@pytest.mark.config({"timeout": 30, "retries": 3})
def test_with_config(configured_resource):
    configured_resource.run()
```
