#!/usr/bin/env bash
set -euo pipefail

# Levantar docker y MYSQL
# Los datos que se muestran a continuación son los defacto en el docker-compose.yml, no cambiar en el archivo .yml o Fzta
MYSQL_CONTAINER=${MYSQL_CONTAINER:-mysql-5.7}
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-UNAL0987}
MYSQL_USER=${MYSQL_USER:-admin}
MYSQL_PASSWORD=${MYSQL_PASSWORD:-UNAL1234}
MYSQL_DATABASE=${MYSQL_DATABASE:-UBudget_db}
SQL_FILE=${1:-init.sql}  #cambiar al archivo SQL cuando lo subamos al repo (recordatorio)

# Comando para levantar el docker compose
docker-compose up -d

echo "Esperando a que MySQL esté listo..."
until docker exec -i "$MYSQL_CONTAINER" mysqladmin ping -h 127.0.0.1 -uroot -p"$MYSQL_ROOT_PASSWORD" --silent >/dev/null 2>&1; do
  sleep 1
done
echo "MySQL listo."
#verificación del archivo sql que se va a trabajar
if [ -f "$SQL_FILE" ]; then
  echo "Importando $SQL_FILE en $MYSQL_DATABASE..."
  docker exec -i "$MYSQL_CONTAINER" mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < "$SQL_FILE"
  echo "Importación completa."
else
  echo "No se encontró $SQL_FILE. Omitiendo import."

    #Sección para instalar dependencias (En trabajo futuro)


    #Sección para realizar testing (En trabajo futuro)

fi