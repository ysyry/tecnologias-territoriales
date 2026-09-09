# Tecnología para el territorio

App para aprender a programar, hecha para las clases de Informática de la Escuela
Don Jaime de Nevares, en Villa La Angostura.

**https://ysyry.github.io/tecnologias-territoriales/**

Es un solo `index.html`. Corre en el navegador, sin servidor y sin instalar nada.

## Qué hay adentro

Al abrir se elige el año y se escribe el nombre. Cada año entra a lo suyo.

**1ro** — primeros pasos: secuencia, algoritmo, bucles, dibujar con código. Incluye un
modo simple, sin texto ni audio, para quien necesite otra entrada.

**2do** — taller de robótica por unidades, más las salas de variables, operadores,
condicionales y programas enteros.

**3ro** — **el cuaderno del proyecto**: siete etapas, una por clase, del 16/09 al 28/10.
En cada una hay algo que hacer, algo que decidir, algo que queda escrito, un checklist de
salida y la bitácora del día. Todo se guarda y se copia con un botón para pegar en el
Classroom, así el grupo trabaja solo y la profe puede evaluar lo que quedó. Aparte, las
**fichas** de consulta (el sensor, el esquema, el código, el cohete) y las **misiones**:
se escribe código de verdad y una placa simulada responde.

Los ejercicios se corrigen solos y explican la respuesta.

## Los tres modos

Se eligen arriba del menú y se cambian cuando quieras. Los tres registran igual.

- **Presentación** — pistas, reintentos y la explicación en el momento. Para proyectar.
- **Práctica** — pistas y reintentos; la explicación aparece recién al resolverlo.
- **Desafío** — sin pistas y un solo intento.

## El número que importa

En práctica se dan muchas ayudas, así que casi todos terminan con puntaje alto. Por eso
se guardan dos números distintos:

- **practicó** — cuántas resolvió, contando ayudas y reintentos
- **sin ayuda** — cuántas le salieron al primer intento

El segundo es el que dice algo.

## Los resultados

Al pie del menú hay un botón gris, *panel docente*. Desde ahí se baja una planilla de
Excel con lo de esa máquina: por año, por alumno y por concepto. La de concepto es la
que muestra dónde se traba el curso.

Si además se configura el buzón (los pasos están en `buzon-apps-script.gs`), cada
resultado se manda solo a una planilla del Drive de la escuela y no hay que juntar nada
a mano.

## Privacidad

Sin buzón, los datos no salen de la máquina. Con buzón, el nombre que escribe el alumno
y sus resultados van a una planilla de Google. Si preferís no guardar nombres completos,
alcanza con el nombre y la inicial del apellido, o el número de lista.

## Cambiar cosas

Está todo en `index.html`. `SALAS` es el banco de ejercicios, `ANIOS` decide qué ve cada
año, `TALLERES` son las unidades con teoría y `MIS` son las misiones.

---

Software libre. Hecho para el aula.
