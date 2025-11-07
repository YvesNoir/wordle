# 🎮 Wordle Amigos

Un juego de Wordle multijugador para competir entre amigos, construido con Next.js, TypeScript y PostgreSQL.

## ✨ Características

- 🔐 **Sistema de autenticación** con usuario y contraseña
- 🎯 **Una palabra por día** - todos juegan la misma palabra
- 🏆 **Leaderboard competitivo** con estadísticas detalladas
- ⏱️ **Tracking de tiempo y intentos** para máxima competencia
- 🌙 **Tema oscuro** con diseño limpio y moderno
- 📱 **Responsive design** optimizado para móviles
- 💾 **Guardado automático** del progreso
- 🔤 **300+ palabras válidas** en español

## 🚀 Tecnologías

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Autenticación**: NextAuth.js
- **Base de datos**: PostgreSQL con Prisma ORM
- **Despliegue**: Vercel (recomendado)

## 📱 Capturas

![Wordle Amigos](./references-images/img.png)

## 🛠️ Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/YvesNoir/wordle.git
cd wordle
```

2. **Instala dependencias**
```bash
npm install
```

3. **Configura variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tu configuración:
```env
DATABASE_URL="postgresql://usuario:password@host:5432/database"
NEXTAUTH_SECRET="tu-secreto-super-seguro"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Configura la base de datos**
```bash
npx prisma generate
npx prisma db push
```

5. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎯 Cómo Jugar

1. **Regístrate** o inicia sesión
2. **Adivina la palabra** de 5 letras del día
3. Tienes **6 intentos** máximo
4. **Compite** en el leaderboard con tus amigos
5. **¡Vuelve mañana** por una nueva palabra!

## 🏆 Sistema de Ranking

El leaderboard se ordena por:
1. **Porcentaje de victoria** (principal)
2. **Partidas ganadas** (desempate)
3. **Promedio de intentos** (menor es mejor)
4. **Tiempo promedio** (menor es mejor)

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Inicia servidor de producción
npm run lint         # Revisa errores de código
```

## 📂 Estructura del Proyecto

```
wordle/
├── src/
│   ├── app/                 # App Router de Next.js
│   │   ├── api/            # API Routes
│   │   ├── auth/           # Páginas de autenticación
│   │   ├── game/           # Página principal del juego
│   │   └── leaderboard/    # Página de ranking
│   ├── components/         # Componentes reutilizables
│   ├── lib/               # Utilidades y configuración
│   └── types/             # Tipos de TypeScript
├── prisma/                # Esquema de base de datos
└── public/               # Archivos estáticos
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Créditos

Desarrollado por [YvesNoir](https://github.com/YvesNoir) con la ayuda de [Claude Code](https://claude.ai/code).

---

¡Diviértete jugando Wordle con tus amigos! 🎮🏆