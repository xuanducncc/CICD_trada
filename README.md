# backend

cp sample.env .env

python3.6+

pip3 install -r requirementx.txt

python3 manage.py makemigrations

python3 manage.py migrate --run-syncdb

python3 manage.py collectstatic

python3 manage.py runserver

# swagger
http://localhost:8000/swagger/