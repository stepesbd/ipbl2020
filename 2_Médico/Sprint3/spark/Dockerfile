FROM openjdk:slim

ADD spark-2.4.6-bin-hadoop2.7 /opt/spark

RUN apt update && apt install -y python

RUN apt install -y procps

RUN mkdir /tmp/spark-events

RUN apt update && \
  apt install -y python-pip && \
  pip install --upgrade pip && \
  pip install numpy && \
  pip install pyspark

# Add future pip packages here
# RUN pip install foo bar baz

ENV PATH="/opt/spark/bin:/opt/spark/sbin:${PATH}"
ENV SPARK_HOME="/opt/spark"
ENV SPARK_LOCAL_IP="0.0.0.0"

ENTRYPOINT ["/opt/spark/bin/spark-class"]

CMD ["org.apache.spark.deploy.master.Master"] 

WORKDIR /opt/spark

