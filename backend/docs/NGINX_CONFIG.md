# Configuración Nginx para Producción

## Límite de Payload

Para permitir CVs con fotos en base64 (hasta 10MB), añadir en la configuración de Nginx:

```nginx
server {
    # ... resto de config

    client_max_body_size 10M;

    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Aplicar en Nginx Proxy Manager (VPS)

1. Abrir Nginx Proxy Manager → Edit proxy host → pestaña **Advanced**
2. Añadir en el campo de configuración adicional:

```
client_max_body_size 10M;
```

3. Guardar y aplicar.

## Aplicar en Nginx directo

```bash
sudo nano /etc/nginx/sites-available/talenthub
# Añadir client_max_body_size 10M; dentro del bloque server {}

sudo nginx -t          # verificar sintaxis
sudo systemctl reload nginx
```

## Referencia

| Capa     | Límite configurado | Archivo                          |
|----------|--------------------|----------------------------------|
| Express  | 10MB               | `src/application/server.ts`      |
| Nginx    | 10MB               | Nginx Proxy Manager → Advanced   |
