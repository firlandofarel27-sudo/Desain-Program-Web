FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY src ./src
COPY web ./web

RUN mkdir -p out

RUN javac -d out src/com/titipin/Main.java

EXPOSE 8080

CMD ["java", "-cp", "out", "com.titipin.Main"]