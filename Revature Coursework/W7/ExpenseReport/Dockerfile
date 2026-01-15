# First Stage - Build and package our app
FROM eclipse-temurin:25-noble AS build
WORKDIR /app
COPY ./ ./ 
RUN ./mvnw dependency:go-offline
RUN ./mvnw package -DskipTests 

# Second Stage - Run the packaged app
FROM eclipse-temurin:25-jre-alpine AS run
WORKDIR /app
COPY --from=build /app/target/ExpenseReport-0.0.1-SNAPSHOT.jar /app/
ENTRYPOINT [ "java", "-jar", "./ExpenseReport-0.0.1-SNAPSHOT.jar"]

EXPOSE 8080
# CMD [ "" ]