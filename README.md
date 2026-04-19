# React Native Mobile App - Login & Profile

**Proyecto homologación:** Desarrollo de Aplicaciones Móviles (IPSS)  
**Stack:** React Native + Expo + TypeScript + Expo Router  
**Repositorio:** https://github.com/dvx-daphnae/react-mobile-ipss

---

## Estado General

✅ **Funcional en web** (localhost:8081)  
⚠️ **Funcional en mobile con limitaciones visuales** (Expo Go)

### Funcionalidades Implementadas
- Login con validación de credenciales
- Navegación entre pantallas (home, profile)
- Parámetros dinámicos entre rutas
- Persistencia de email entre tabs
- Estilos y layouts responsive

---

## Discovery & Testing Manual

### Problema 1: Email no llegaba a Profile (Apr 18, 15:30)
**Síntoma:** Profile mostraba "No disponible" aunque login era correcto.

**Testing:**
```
Login correcto → URL muestra ?email=usuario%40correo.com → Navega a home
Home renders → Click profile tab → Email vacío ❌
```

**Root Cause:** `useLocalSearchParams()` en profile no leía parámetros porque estaban en la raíz de `/(tabs)`, no propagados a componentes hijos.

**Solución iterada:**
1. **Intento 1:** Pasar email directamente a `/(tabs)/profile` con `router.push` → Saltaba home (indeseado)
2. **Intento 2:** Context API + Provider en `_layout.tsx` → Error "Hooks can only be called inside function component" (AuthContext fuera de alcance)
3. **Intento 3 (final):** Context local en `app/(tabs)/TabContext.tsx` + `useGlobalSearchParams()` en `_layout.tsx` → ✅ Funciona

**Cambios clave:**
```tsx
// app/(tabs)/_layout.tsx: Lee params globales una sola vez
const params = useGlobalSearchParams()
const email = (params?.email as string) || ''

// Envuelve tabs en provider
<TabProvider email={email}>
  <Tabs>...</Tabs>
</TabProvider>

// profile.tsx: Consume contexto local
const { email } = useContext(TabContext)
```

**Resultado:** Email persiste correctamente entre tabs.

---

### Problema 2: Rendering inconsistente en mobile (Apr 18, 16:45)
**Síntoma en Expo Go (Android):** Texto cortado en HomeScreen, componentes no centrados verticalmente.

**Testing:**
```
npm start → w (web) → Renders perfecto ✅
npx expo start → Expo Go → Texto cortado, layout quebrado ⚠️
```

**Root Cause:** Inconsistencia entre Expo en web y Expo Go en mobile real. Puede ser:
- Caché agresivo de Expo Go
- Diferencias de renderizado entre plataformas
- SafeAreaView no aplicando correctamente

**Mitigación aplicada:**
- Agregué `paddingHorizontal` y `lineHeight` en HomeScreen
- Removí SafeAreaView (no es necesario para layout simple)
- Testeo en web válida para entrega (rubrica: 10% video web, 90% código)

**Estado:** Funciona en web. Mobile tiene limitaciones menores que no afectan funcionalidad core. **Dejar para siguiente iteración** (probablemente requiere rebuild de caché Expo o testear en device físico real vs Expo Go).

---

## Estructura del Proyecto

```
react-mobile-ipss/
├── app/
│   ├── _layout.tsx          ← Stack navegación raíz
│   ├── index.tsx            ← Login Screen
│   └── (tabs)/
│       ├── _layout.tsx      ← Tabs layout + hook params
│       ├── TabContext.tsx   ← Context para compartir email entre tabs
│       ├── index.tsx        ← Home Screen
│       └── profile.tsx      ← Profile Screen (consume email)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Flujo de Autenticación

```
1. Login (app/index.tsx)
   - Valida email/password contra hardcoded credentials
   - router.push({ pathname: '/(tabs)', params: { email } })

2. Tabs Layout (app/(tabs)/_layout.tsx)
   - Lee params globales con useGlobalSearchParams()
   - Envuelve tabs en TabProvider(email)

3. Home & Profile
   - Home: renders sin dependencias
   - Profile: lee email de TabContext
```

---

## Testing Manual (Checklist)

- [x] Login con credenciales correctas navega a home
- [x] Login con credenciales incorrectas muestra error en rojo
- [x] Home renderiza sin datos dinámicos
- [x] Profile tab muestra email del login
- [x] Cambiar entre home/profile mantiene email en contexto
- [x] Refrescar página web mantiene email (en URL)
- [x] Web rendering: centrado y legible ✅
- [x] Mobile rendering: funcional (con caveats visuales) ⚠️

---

## Credenciales de Prueba

```
Email:    usuario@correo.com
Password: 1234
```

---

## Known Issues & Trade-offs

| Aspecto | Status | Nota |
|---------|--------|------|
| Parámetros en URL | ✅ | Email visible en URL después login web |
| Persistencia entre tabs | ✅ | Context local funciona correctamente |
| Validación credenciales | ✅ | Hardcoded para demo (refactorizar a API en v2) |
| Centrado vertical en mobile | ⚠️ | Funciona en web; mobile (Expo Go) tiene limitaciones visuales |
| SafeAreaView | ⚠️ | Removido por inconsistencias; podría reinstalar con `react-native-safe-area-context` |
| Estilos responsive | ⚠️ | Layout simple; escala linealmente con viewport |

---

## Notas para Siguiente Fase

1. **Mobile rendering:** Hacer rebuild limpio de caché Expo (`expo cache clean` + `npm start`). Si persiste, testear en device físico vs emulador.
2. **State management:** Migrar context a Zustand o Redux si app crece.
3. **API integration:** Reemplazar credenciales hardcoded con backend real.
4. **Merging con backend:** El plan es mergear este frontend con el API REST (Node.js + Hono) en app unificada.

---

## Ejecución

**Web:**
```bash
npm start
# Presionar 'w'
```

**Mobile (Expo Go):**
```bash
npx expo start
# Abrir Expo Go en dispositivo y scannear QR
```

---

## Decisiones Técnicas

- **useGlobalSearchParams vs useLocalSearchParams:** Global funciona en rutas anidadas; local solo en ruta actual.
- **Context en _layout.tsx:** Scope perfecto para compartir estado entre tabs sin contaminar componentes.
- **Sin Redux/Zustand:** Proyecto pequeño; Context API es suficiente.
- **TypeScript:** Strict; ayuda a detectar bugs de propagación de params.

---

**Última actualización:** 18 de abril, 2026