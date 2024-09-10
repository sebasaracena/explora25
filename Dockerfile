# Usa una imagen de Node.js como base
FROM node:12-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y el package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código del proyecto
COPY . .

# Construye la aplicación Angular
RUN npm run build --prod

# Exponer el puerto en el que correrá la aplicación
EXPOSE 80

# Instala un servidor HTTP para servir la aplicación
RUN npm install -g http-server

# Comando para ejecutar la aplicación
CMD ["http-server", "dist/aniversario25", "-p", "80", "-c-1", "--host", "0.0.0.0"]
