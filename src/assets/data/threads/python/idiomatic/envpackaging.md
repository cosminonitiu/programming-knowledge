## Virtual Environments and Packaging
---

Reproducible dependency management is critical in data engineering and backend projects. Python's ecosystem has evolved from bare `pip` + `requirements.txt` to modern tools with lockfiles, build backends and `pyproject.toml`.

---

## 1. Why Virtual Environments?

Without isolation, all projects on a machine share the same global Python installation and packages. Conflicting dependency versions cause subtle bugs. Virtual environments solve this by creating a self-contained Python installation per project.

---

## 2. `venv` — Built-in Virtual Environments

```bash
# Create a virtual environment in .venv/
python3 -m venv .venv

# Activate (macOS / Linux)
source .venv/bin/activate

# Activate (Windows Command Prompt)
.venv\Scripts\activate.bat

# Activate (Windows PowerShell)
.venv\Scripts\Activate.ps1

# Confirm which Python is active
which python   # or: python --version

# Deactivate
deactivate
```

---

## 3. `pip` — Package Installer

```bash
pip install fastapi                  # latest version
pip install "fastapi==0.111.0"       # pin exact version
pip install "sqlalchemy>=2.0,<3.0"  # version range

pip uninstall package-name
pip list                             # installed packages
pip show fastapi                     # metadata for a package

# Upgrade
pip install --upgrade fastapi
```

---

## 4. `requirements.txt` — Dependency Lockfile

```bash
# Freeze current environment
pip freeze > requirements.txt

# Install from lockfile
pip install -r requirements.txt

# Separate dev dependencies (convention)
pip freeze > requirements-dev.txt
```

Example `requirements.txt`:
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
pydantic==2.7.1
sqlalchemy==2.0.30
httpx==0.27.0
```

---

## 5. `pyproject.toml` — Modern Project Standard

`pyproject.toml` (PEP 517/518/621) is now the standard for defining project metadata, dependencies and build configuration:

```toml
[project]
name = "my-service"
version = "1.0.0"
description = "A FastAPI backend service"
requires-python = ">=3.11"
dependencies = [
    "fastapi>=0.111",
    "uvicorn[standard]>=0.29",
    "pydantic>=2.0",
    "sqlalchemy>=2.0",
    "alembic>=1.13",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "pytest-asyncio>=0.23",
    "httpx>=0.27",
    "mypy>=1.9",
    "ruff>=0.4",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.mypy]
strict = true
python_version = "3.12"

[tool.ruff]
line-length = 100
target-version = "py312"
```

---

## 6. Poetry — Dependency Management with Lockfiles

Poetry manages dependencies, virtual environments and publishing in one tool:

```bash
pip install poetry

# New project
poetry new my-service
cd my-service

# Add dependencies
poetry add fastapi uvicorn
poetry add --group dev pytest mypy ruff

# Install (creates .venv automatically)
poetry install

# Run within environment
poetry run python main.py
poetry run pytest

# Lockfile (poetry.lock) — commit this!
poetry lock

# Show environment info
poetry env info
```

---

## 7. `pip-tools` — Deterministic Dependency Resolution

`pip-tools` separates abstract dependencies (`requirements.in`) from pinned lockfiles (`requirements.txt`):

```bash
pip install pip-tools

# requirements.in (high-level, unpinned)
# fastapi
# sqlalchemy>=2.0

pip-compile requirements.in     # generates requirements.txt with all transitive pins
pip-compile requirements-dev.in

pip-sync requirements.txt       # install EXACTLY what's in lockfile (removes extras)
```

---

## 8. Environment Variables for Configuration

Never hardcode secrets or environment-specific values. Use `pydantic-settings`:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    debug: bool = False
    log_level: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
```

`.env` file (never commit to version control):
```
DATABASE_URL=postgresql://user:pass@localhost/mydb
SECRET_KEY=super-secret-key
DEBUG=true
```

---

## 9. `.gitignore` Essentials for Python Projects

```
# Virtual environments
.venv/
venv/
env/

# Bytecode
__pycache__/
*.pyc
*.pyo

# Distribution
dist/
build/
*.egg-info/

# Environment files
.env
.env.local

# Test artifacts
.pytest_cache/
.coverage
htmlcov/

# mypy
.mypy_cache/
```
