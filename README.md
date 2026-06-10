# 🧮 Calculadora de Gastos Básica

![Calculadora de Gastos Básica](images/index.png)

## Descripción

Esta es una calculadora de gastos básica que permite sumar los gastos de varias personas y dividir el total entre la cantidad de personas. Los datos se guardan en el localStorage del navegador.

![Calculadora de Gastos Básica](images/index.png)

## 🚀 Características

- **Simplicidad:** Interfaz intuitiva y fácil de usar.
- **Rapidez:** Resultados inmediatos.
- **Persistencia:** Los datos se guardan en el localStorage del navegador.

## 💻 Tecnologías Usadas

- **HTML5:** Estructura básica de la interfaz.
- **CSS3:** Estilo visual limpio y básico.
- **JavaScript (ES6):** Lógica del calculador y almacenamiento local (`localStorage`).

## 🛠️ Instalación y Ejecución

Para ejecutar esta aplicación, necesitas tener instalado [Docker](https://www.docker.com/).

### 1. Crear la imagen

Navega al directorio raíz del proyecto y ejecuta el siguiente comando para construir la imagen de Docker:

```bash
docker build -t calculadora-gastos .
```

### 2. Ejecutar el contenedor

Una vez construida la imagen, inicia el contenedor de la siguiente manera:

```bash
docker run -p 8080:80 --name calculadora-gastos-app calculadora-gastos
```

### 3. Acceder a la aplicación

Abre tu navegador y accede a la siguiente dirección:

[http://localhost:8080](http://localhost:8080)

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.