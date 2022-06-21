%~d1
cd "%~p1"

cd "www"
start chrome --incognito "http://localhost:8000"
python -m http.server