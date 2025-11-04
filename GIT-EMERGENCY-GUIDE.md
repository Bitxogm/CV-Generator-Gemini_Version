# 🆘 GIT EMERGENCY GUIDE - Manual de Pánico

> **"RESPIRA. TODO TIENE SOLUCIÓN (excepto `rm -rf .git`)"**

---

## 🚨 PROTOCOLO DE EMERGENCIA

### Cuando Git se rompa, sigue estos pasos EN ORDEN:

```bash
# 1. ✋ PARA - No toques nada más
# 2. 🧘 RESPIRA - El pánico empeora todo
# 3. 📊 DIAGNOSTICA - Ejecuta estos 3 comandos:

git status
git log --oneline -10
git branch -a

# 4. 📋 COPIA los resultados
# 5. 🤔 PREGUNTA (ChatGPT, Claude, Stack Overflow)
# 6. ⚡ EJECUTA solo lo que te digan, PASO A PASO
# 7. ✅ VERIFICA después de cada comando
```

---

## 🟢 COMANDOS SEGUROS (siempre puedes usarlos)

Estos comandos SOLO CONSULTAN, no modifican nada:

```bash
git status              # ¿Qué está pasando?
git log --oneline -10   # Últimos 10 commits
git log --graph --all   # Historial visual de ramas
git branch              # ¿En qué rama estoy?
git branch -a           # Todas las ramas (local + remoto)
git diff                # ¿Qué cambió?
git diff --cached       # ¿Qué está en staging?
git remote -v           # ¿A dónde apunta mi remoto?
git reflog              # Historial de TODO (salvavidas)
```

**🎯 Regla de oro**: Si no estás seguro, primero usa comandos de CONSULTA.

---

## 🟡 COMANDOS DE MEDIO RIESGO (piensa antes)

```bash
git add <archivo>       # Añadir al staging
git add .               # Añadir TODO (cuidado con archivos grandes)
git commit -m "mensaje" # Crear commit
git pull                # Traer cambios (puede causar conflictos)
git merge <rama>        # Unir ramas (puede causar conflictos)
git checkout <rama>     # Cambiar rama (guarda cambios antes)
git switch <rama>       # Igual que checkout (más moderno)
git stash               # Guardar cambios temporalmente
git stash pop           # Recuperar cambios guardados
```

**⚠️ Aviso**: Estos pueden causar conflictos, pero SON RECUPERABLES.

---

## 🔴 COMANDOS PELIGROSOS (NUNCA en pánico)

```bash
git reset --hard        # ❌ BORRA cambios sin commit
git rebase              # ❌ Reescribe historia (avanzado)
git push -f             # ❌ Fuerza push (sobreescribe remoto)
git push --force        # ❌ Igual que arriba
git clean -fd           # ❌ Borra archivos no rastreados
rm -rf .git             # ☠️ DESTRUCCIÓN NUCLEAR
```

**🚫 REGLA ABSOLUTA**: Si estás en pánico, NO uses estos comandos.

---

## 📚 SOLUCIONES A PROBLEMAS COMUNES

### 🆘 "Estoy en medio de un rebase y todo está roto"

```bash
# SOLUCIÓN INMEDIATA: Abortar el rebase
git rebase --abort

# Ahora estás de vuelta donde empezaste
git status  # Verificar que todo está normal
```

### 🆘 "Git rechaza mi push"

```bash
# Mensaje típico: "rejected - fetch first"
# SOLUCIÓN:
git pull origin <rama>

# Si hay conflictos, resuélvelos:
# 1. Abre los archivos con conflictos
# 2. Busca <<<<<<< y =======
# 3. Decide qué código mantener
# 4. Elimina los marcadores
# 5. git add <archivos>
# 6. git commit -m "fix: resolver conflictos"
# 7. git push origin <rama>
```

### 🆘 "Hice commit de algo que no debía"

```bash
# Si NO has hecho push todavía:
git reset --soft HEAD~1  # Deshace último commit, mantiene cambios

# Si YA hiciste push:
# NO uses reset, mejor haz un nuevo commit que revierta
git revert HEAD  # Crea commit que deshace el anterior
```

### 🆘 "Tengo cambios que no quiero commitear ahora"

```bash
# Guardarlos temporalmente:
git stash

# Cuando los necesites de vuelta:
git stash pop

# Ver qué tienes guardado:
git stash list
```

### 🆘 "Me cambié de rama sin guardar cambios"

```bash
# Si Git te lo permitió, tus cambios se movieron con la rama
# Vuelve a la rama original:
git checkout <rama-anterior>

# O mejor, guárdalos primero:
git stash
git checkout <otra-rama>
# ... hacer cosas ...
git checkout <rama-original>
git stash pop
```

### 🆘 "Borré algo importante con reset --hard"

```bash
# ¡Hay esperanza! Usa el reflog:
git reflog  # Muestra TODO lo que hiciste

# Busca el commit ANTES del reset
# Digamos que era abc1234
git checkout abc1234

# O crea una rama desde ahí:
git branch rama-recuperada abc1234
```

### 🆘 "Conflictos de merge - no sé qué hacer"

```bash
# Ver qué archivos tienen conflictos:
git status

# Abrir cada archivo y buscar:
# <<<<<<< HEAD
# tu código
# =======
# código de la otra rama
# >>>>>>> nombre-rama

# Resolver:
# 1. Decidir qué código mantener
# 2. Borrar los marcadores <<<<<<< ======= >>>>>>>
# 3. Guardar el archivo

# Marcar como resuelto:
git add <archivo-resuelto>

# Cuando todos estén resueltos:
git commit -m "merge: resolver conflictos"

# Si te pierdes, siempre puedes:
git merge --abort  # Cancela el merge y vuelve al estado anterior
```

---

## 🎯 FLUJO DE TRABAJO IDEAL

```bash
# 1. ANTES de empezar a trabajar:
git checkout dev
git pull origin dev  # ⭐ IMPORTANTE: actualizar primero

# 2. Crear rama de feature:
git checkout -b feature/nueva-funcionalidad

# 3. Trabajar normalmente:
# ... hacer cambios ...
git add .
git commit -m "feat: descripción clara"

# 4. ANTES de hacer merge, actualizar dev:
git checkout dev
git pull origin dev

# 5. Hacer merge:
git merge feature/nueva-funcionalidad

# 6. Si hay conflictos, resolverlos (ver sección arriba)

# 7. Push:
git push origin dev

# 8. Sincronizar main si es necesario:
git checkout main
git merge dev
git push origin main
```

---

## 🎓 LECCIONES APRENDIDAS (02/11/2025)

### ❌ Lo que NO funcionó:
- Crear `keep-supabase-alive.yml` en la raíz en vez de `.github/workflows/`
- Entrar en pánico cuando Git rechazó el push
- Hacer `git reset --hard` sin saber dónde estaba
- Ejecutar comandos random esperando que "algo funcione"
- Pensar en borrar `.git` como solución

### ✅ Lo que SÍ funcionó:
- Abortar el rebase corrupto con `git rebase --abort`
- Usar `git status` y `git log` para diagnosticar
- Resolver conflictos de merge con calma
- Pedir ayuda en vez de seguir liando más
- Seguir instrucciones paso a paso sin saltarse nada

### 💡 La gran lección:
> **"Git no es el problema. El pánico lo es."**
> 
> Con información y calma, casi TODO en Git tiene solución.

---

## 🔧 TRUCOS ÚTILES

### Ver el estado de forma visual:
```bash
git log --graph --oneline --all --decorate
```

### Comparar dos ramas:
```bash
git diff rama1..rama2
```

### Ver quién modificó cada línea:
```bash
git blame <archivo>
```

### Buscar un commit por mensaje:
```bash
git log --grep="texto-a-buscar"
```

### Deshacer cambios en un archivo específico:
```bash
git checkout -- <archivo>  # Antes de add
git restore <archivo>      # Forma moderna
```

### Ver historial de un archivo específico:
```bash
git log --follow <archivo>
```

---

## 🆘 ÚLTIMO RECURSO: El Reflog

Si todo falla y crees que perdiste algo, el reflog es tu salvavidas:

```bash
# Ver TODO lo que has hecho:
git reflog

# Salida ejemplo:
# abc1234 HEAD@{0}: commit: último commit
# def5678 HEAD@{1}: reset: moving to HEAD~1
# ghi9012 HEAD@{2}: commit: el commit que "perdiste"

# Recuperar algo:
git checkout ghi9012
git branch rama-recuperada  # Guárdalo en una rama nueva
```

---

## 📞 CUANDO TODO FALLE

1. **NO borres `.git`** - Eso es irreversible
2. **NO hagas push -f** sin estar 100% seguro
3. **Pregunta** antes de ejecutar comandos destructivos
4. Usa `git reflog` - casi siempre hay solución
5. Si trabajas en equipo, **pide ayuda** a un compañero

---

## 🎯 MANTRAS PARA RECORDAR

1. **"git status es mi amigo"** - Úsalo antes de cada decisión
2. **"Información > Acción"** - Diagnosticar antes que ejecutar
3. **"Paso a paso"** - Un comando, verificar, siguiente
4. **"El pánico empeora todo"** - Respirar primero, comandos después
5. **"Casi todo tiene solución"** - Excepto borrar .git

---

## 🏁 CHECKLIST PRE-PÁNICO

Antes de entrar en pánico, marca esto:

- [ ] ¿Ejecuté `git status`?
- [ ] ¿Ejecuté `git log --oneline -10`?
- [ ] ¿Copié los mensajes de error?
- [ ] ¿Respiré profundamente?
- [ ] ¿Pregunté antes de ejecutar comandos peligrosos?

Si respondiste NO a alguno, hazlo AHORA antes de continuar.

---

## 🎓 RECURSOS ADICIONALES

- [Git Cheat Sheet oficial](https://education.github.com/git-cheat-sheet-education.pdf)
- [Oh Shit, Git!?!](https://ohshitgit.com/) - Soluciones rápidas
- [Git Flight Rules](https://github.com/k88hudson/git-flight-rules) - Qué hacer cuando...
- [Visualizing Git](https://git-school.github.io/visualizing-git/) - Entender qué hace cada comando

---

## 💪 MENSAJE FINAL

> **Recordatorio**: Git es una herramienta poderosa, no tu enemigo.
> 
> Cada error es una oportunidad de aprender.
> 
> Hoy resolviste un problema de 2 horas en 30 minutos con ayuda.
> 
> La próxima vez, lo harás solo en 10 minutos.
> 
> **Eres más fuerte en Git de lo que crees.** 🚀

---

*Creado el 02/11/2025 después de sobrevivir a un rebase corrupto, conflictos de merge y casi borrar .git* 😅

*"De los errores se aprende, pero de los errores con Git se aprende el doble"* - Otaku1944
