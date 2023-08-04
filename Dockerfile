FROM python:3.8

RUN pip install --upgrade pip
RUN pip install Flask
RUN pip install psycopg2-binary
RUN pip install flask-cors
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./server/*.py ./

EXPOSE 6000

ENTRYPOINT ["python3", "main.py"]
