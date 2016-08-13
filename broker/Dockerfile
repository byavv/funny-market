FROM rabbitmq:latest

RUN rabbitmq-plugins enable --offline rabbitmq_management
RUN rabbitmq-plugins enable --offline rabbitmq_mqtt

EXPOSE 15672
EXPOSE 1883
EXPOSE 5672
