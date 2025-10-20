#!/bin/bash

echo "🔍 Escaneando posibles secretos en los ficheros a commitear..."

# Define las palabras clave a buscar
keywords=("apikey" "api_key" "secret" "token" "password" "firebase" "key" "pass" "client_id" "client_secret" "bearer")

# Obtenemos la lista de los ficheros en el staging area y le pasamos los nombres a grep.
# Utilizamos `git diff --cached --name-only` para archivos en staging.
grep_output=$(git diff --cached --name-only --diff-filter=ACM | xargs grep -iE "${keywords[@]}" 2>/dev/null)

if [ -z "$grep_output" ]; then
    echo "✅ No se encontraron posibles secretos en los ficheros a commitear."
    exit 0
else
    echo "⚠️ ¡Advertencia! Se detectaron posibles secretos en los siguientes ficheros:"
    echo "$grep_output"
    echo

    # Redireccionamos la entrada a /dev/tty para que el script pueda leer la respuesta del usuario
    # incluso cuando se ejecuta dentro del hook de git.
    read -r -p "¿Quieres continuar con el commit de todas formas? (s/N): " confirm < /dev/tty

    if [[ "$confirm" == "s" || "$confirm" == "S" ]]; then
        echo "✅ Continuando con el commit..."
        exit 0
    else
        echo "❌ Commit cancelado. Revisa los archivos señalados y añádelos a .gitignore si es necesario."
        exit 1
    fi
fi
