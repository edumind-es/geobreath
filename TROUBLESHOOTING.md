# GeoBreath 2.0 - Troubleshooting Guide

## 🔥 Firefox Error: "can't access property 0, n is undefined"

### **Síntoma**
- La aplicación funciona correctamente en Chrome y Safari
- En Firefox aparece el error: `Uncaught TypeError: can't access property 0, n is undefined`
- El error aparece en archivos JS compilados de Next.js (ej: `aba6f11863b257d3.js`)

### **Causa**
El **React Compiler** (opción `reactCompiler: true` en `next.config.ts`) tiene problemas de compatibilidad con Firefox cuando se usa con:
- React 19
- Next.js 16
- Optimizaciones de compilación que Firefox no maneja correctamente

### **Solución Implementada** ✅

**Fecha**: 2025-12-12

Desactivamos el React Compiler en `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true, // Disabled: causes Firefox compatibility issues with React 19
};
```

**Pasos ejecutados**:
1. Comentar `reactCompiler: true` en `next.config.ts`
2. Rebuild: `npm run build`
3. Reiniciar servicio: `pkill -f "next start"` (systemd lo reinicia automáticamente)

### **Verificación**
✅ Build completado sin errores  
✅ Servicio activo y corriendo  
✅ Compatible con Firefox, Chrome, Safari

---

## 🚨 Otros Errores Comunes

### Error: "Could not find a production build"

**Síntoma**: El servicio arranca pero Next.js dice que falta el build

**Solución**:
```bash
cd /var/www/geobreath_react
npm run build
pkill -f "next start"  # systemd reinicia automáticamente
```

### Servicio no arranca después de rebuild

**Verificar status**:
```bash
systemctl status geobreath-react.service
journalctl -u geobreath-react.service -n 50
```

**Reinicio manual**:
```bash
sudo systemctl restart geobreath-react.service
```

---

## 🔄 Proceso de Actualización Seguro

Cuando hagas cambios al código:

```bash
# 1. Build
npm run build

# 2. Verificar que el build fue exitoso
ls -la .next/BUILD_ID

# 3. Reiniciar servicio (sin sudo)
pkill -f "next start"

# 4. Verificar que arrancó correctamente
sleep 2
systemctl status geobreath-react.service

# 5. Test en navegador
curl -I https://breath.edumind.es
```

---

## 📦 Purgar Caché de Cloudflare

Si ves contenido antiguo después de un deploy:

```bash
cd /var/www/geobreath_react
./purge-breath-cache.sh
```

O usa el script completo:
```bash
/var/www/edumind_website/purge-cloudflare.sh
```

---

## 🐛 Debug en Firefox

Para verificar errores específicos de Firefox:

1. Abrir DevTools (F12)
2. Ir a la pestaña **Console**
3. Recargar la página con **Ctrl+Shift+R** (hard reload)
4. Buscar errores en rojo

**Archivos relevantes para revisar**:
- `src/app/page.tsx` - Componente principal
- `src/lib/useBreathingFeedback.ts` - Hooks personalizados
- `next.config.ts` - Configuración de Next.js

---

## 📝 Notas Finales

- **React Compiler**: Desactivado por incompatibilidad con Firefox
- **React 19**: Compatible una vez desactivado el compiler
- **Next.js 16**: Funcionando correctamente
- **Navegadores soportados**: Firefox, Chrome, Safari, Edge

**Última actualización**: 2025-12-12  
**Mantenedor**: EDUmind Team
