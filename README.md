# PinguLibrary

## Technologies:
- [Java 21](https://docs.oracle.com/en/java/): main programming language

- [Spring Boot](https://docs.spring.io/spring-boot/index.html): application framework

- [Spring Web](https://docs.spring.io/spring-framework/reference/web/webmvc.html): REST API layer

- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/index.html): database access and ORM

- [PostgreSQL](https://www.w3schools.com/postgresql/index.php): relational database

- [OpenAPI / Swagger](https://learn.openapis.org/): API documentation and specification

- [Maven](https://maven.apache.org/guides/): build and dependency management tool

## Project created with [Spring initializr](https://start.spring.io/):
![image Spring initializr](image.png)

## OpenAPI
The OpenAPI documentation was written following [Swagger PetStore example](https://editor.swagger.io/).

## Pingu Library API
### Introduction:
Pingu Library API (v1.0.0) is a REST API for managing a library system, served at http://localhost:8080/api. It exposes two main resource groups: 
- **/books** for creating, retrieving, updating, and deleting books;
- **/loans** for handling the full lifecycle of a book loan. 

Books can also be searched by title, author, publisher, year, genre, and language via the **/books/findByInfo** endpoint. All responses return JSON payloads, with errors handled through a consistent Error schema carrying a code and a message. The API follows standard HTTP status codes to communicate the outcome of each operation.

### Pingu Library OpenAPI:
Link [Pingu Library OpenAPI (v1.0.0)](pinguLibrary\openAPI.yaml)
