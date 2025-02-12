FROM gcc:14.2.0-bookworm

RUN apt-get update && apt-get install -y wget

RUN mkdir -p /usr/include/nlohmann

RUN wget -O /usr/include/nlohmann/json.hpp https://github.com/nlohmann/json/releases/latest/download/json.hpp