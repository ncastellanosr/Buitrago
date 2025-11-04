# Investigación de APIs de Datos Financieros para UBudget

**Autor:** MiniMax Agent
**Fecha:** 2025-06-21

## Resumen Ejecutivo

Este informe detalla la investigación y evaluación de diversas APIs de datos financieros para el sitio web "UBudget". El objetivo es proporcionar recomendaciones prácticas para la implementación de precios de acciones en tiempo real, noticias financieras y datos sobre otros instrumentos de inversión, con un enfoque en el mercado colombiano y latinoamericano. Se priorizan las opciones gratuitas o de bajo costo con buena documentación y facilidad de integración.

## 1. APIs de Precios de Acciones

### 1.1. Yahoo Finance (`yfinance`)

- **Descripción:** Aunque no es una API oficial, la biblioteca `yfinance` para Python es una de las formas más populares y sencillas de acceder a los datos de Yahoo Finance. Ofrece una amplia gama de datos, incluyendo precios históricos y en tiempo real (con un ligero retraso), información fundamental de la empresa, dividendos, splits y más.
- **Costo:** Gratuito.
- **Autenticación:** No se requiere autenticación.
- **Documentación:** La documentación de la biblioteca `yfinance` en PyPI y GitHub es completa y fácil de seguir.
- **Datos para Colombia/LatAm:** Tiene una buena cobertura de acciones de la Bolsa de Valores de Colombia (BVC) y otros mercados de la región. Los tickers de la BVC deben terminar con el sufijo `.BO` (por ejemplo, `ECOPETROL.BO`).
- **Ejemplo de Código (Python):**

  ```python
  import yfinance as yf

  # Obtener datos de Ecopetrol
  ecopetrol = yf.Ticker("ECOPETROL.BO")

  # Obtener el precio actual
  precio_actual = ecopetrol.history(period="1d")['Close'].iloc[-1]
  print(f"Precio actual de Ecopetrol: {precio_actual}")

  # Obtener información de la empresa
  info = ecopetrol.info
  print(f"Nombre: {info['longName']}")
  print(f"Sector: {info['sector']}")
  ```

- **Recomendación:** **Altamente recomendado.** `yfinance` es la mejor opción para empezar, especialmente por su facilidad de uso, costo cero y buena cobertura de datos para Colombia.

### 1.2. Alpha Vantage

- **Descripción:** Una API popular que ofrece datos de acciones, forex y criptomonedas. Proporciona datos en tiempo real e históricos, así como indicadores técnicos.
- **Costo:** Ofrece un plan gratuito generoso con hasta 25 solicitudes por día. Los planes de pago ofrecen más solicitudes y acceso a datos premium.
- **Autenticación:** Requiere una clave de API gratuita.
- **Documentación:** Documentación clara y completa con ejemplos en varios lenguajes.
- **Datos para Colombia/LatAm:** La cobertura para mercados latinoamericanos es aceptable, pero puede ser menos completa que la de Yahoo Finance.
- **Ejemplo de Código (Python):**

  ```python
  import requests

  API_KEY = "TU_API_KEY"
  symbol = "ECOPETROL.BOG"
  url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={API_KEY}'

  r = requests.get(url)
  data = r.json()

  print(data)
  ```

- **Recomendación:** **Recomendado como alternativa o complemento.** Es una excelente opción si se necesita una API más formal con una clave y si el límite de solicitudes del plan gratuito es suficiente.

### 1.3. Finnhub

- **Descripción:** Proporciona datos de acciones, forex, criptomonedas y noticias financieras a través de una API WebSocket y REST.
- **Costo:** Ofrece un plan gratuito con 60 llamadas a la API por minuto. Los planes de pago ofrecen más llamadas, datos en tiempo real y características adicionales.
- **Autenticación:** Requiere una clave de API gratuita.
- **Documentación:** Documentación muy detallada y bien organizada.
- **Datos para Colombia/LatAm:** Buena cobertura para la región.
- **Recomendación:** **Recomendado.** Una opción muy sólida, especialmente si se necesita una API WebSocket para actualizaciones en tiempo real.

## 2. APIs de Noticias Financieras

### 2.1. News API

- **Descripción:** Una API popular para buscar noticias y titulares de miles de fuentes en todo el mundo.
- **Costo:** Plan gratuito para desarrolladores con 100 solicitudes por día. Los planes de pago ofrecen más solicitudes y funciones avanzadas.
- **Autenticación:** Requiere una clave de API gratuita.
- **Documentación:** Excelente documentación con ejemplos claros.
- **Datos para Colombia/LatAm:** Permite filtrar noticias por país (incluyendo Colombia) y en español.
- **Ejemplo de Código (Python):**

  ```python
  import requests

  API_KEY = "TU_API_KEY"
  url = f'https://newsapi.org/v2/top-headlines?country=co&category=business&apiKey={API_KEY}'

  r = requests.get(url)
  data = r.json()

  for article in data['articles']:
      print(article['title'])
  ```

- **Recomendación:** **Altamente recomendado.** La mejor opción para noticias financieras generales debido a su facilidad de uso y la capacidad de filtrar por país y categoría.

### 2.2. Newsdata.io

- **Descripción:** API de noticias similar a News API, con un enfoque en datos de noticias globales.
- **Costo:** Ofrece un plan gratuito con un número limitado de solicitudes.
- **Autenticación:** Requiere una clave de API gratuita.
- **Documentación:** Buena documentación.
- **Datos para Colombia/LatAm:** También permite filtrar por país e idioma.
- **Recomendación:** **Recomendado como alternativa.** Una buena opción si se necesita una fuente de noticias adicional.

### 2.3. EOD Historical Data

- **Descripción:** Además de datos de mercado, EODHD ofrece una API de noticias financieras.
- **Costo:** El acceso a la API de noticias generalmente requiere un plan de pago.
- **Recomendación:** Considerar solo si ya se está utilizando EODHD para otros datos y se desea consolidar proveedores.

## 3. Otros Instrumentos Financieros (CDTs, Bonos, Finca Raíz)

La obtención de datos para estos instrumentos a través de APIs es más compleja, ya que a menudo no existen APIs públicas estandarizadas.

### 3.1. CDTs y Bonos

- **Fuentes de Datos:**
  - **Banco de la República de Colombia:** Publica tasas de interés de referencia y datos sobre subastas de bonos del gobierno (TES). No proporciona una API REST directa, pero los datos a menudo se pueden descargar en formatos como CSV o Excel desde su sitio web.
  - **Superintendencia Financiera de Colombia:** Publica información sobre tasas de captación de CDTs de diferentes entidades financieras. Al igual que el Banco de la República, no suele ofrecer una API, pero los datos están disponibles para su consulta y descarga.
  - **Datos Abiertos Colombia:** El portal de datos abiertos del gobierno colombiano (`datos.gov.co`) puede contener conjuntos de datos relevantes sobre bonos y otros instrumentos, aunque no en tiempo real.

- **Estrategia de Implementación:**
  - **Web Scraping:** La técnica más viable para obtener datos actualizados de CDTs y bonos de forma programática sería el *web scraping* de los sitios web del Banco de la República y la Superintendencia Financiera. Esto implicaría escribir un script (por ejemplo, en Python con bibliotecas como `BeautifulSoup` y `Requests`) para extraer la información relevante de las tablas HTML de estas páginas.
  - **Descarga Manual/Automatizada de Archivos:** Para datos menos urgentes, se podría implementar un proceso que descargue y procese periódicamente los archivos CSV o Excel publicados por estas entidades.

- **Recomendación:** Para CDTs y bonos, la mejor estrategia es una combinación de **web scraping** para obtener datos actualizados de las tasas y la consulta de **fuentes de datos oficiales** para información histórica y de referencia. No hay una solución de API "plug-and-play" evidente.

### 3.2. Finca Raíz

- **Fuentes de Datos:**
  - **Portales Inmobiliarios:** Sitios como `fincaraiz.com.co`, `metrocuadrado.com` y `ciencuadras.com` son las principales fuentes de datos sobre precios de venta y arriendo de inmuebles en Colombia.
  - **Datos Abiertos Colombia:** Como se mencionó anteriormente, puede haber conjuntos de datos sobre inmuebles disponibles.

- **Estrategia de Implementación:**
  - **Web Scraping:** Al igual que con los CDTs y los bonos, el *web scraping* es la única forma realista de obtener una gran cantidad de datos sobre el mercado inmobiliario. Esto permitiría recopilar información sobre precios, áreas, ubicaciones y otras características de las propiedades.
  - **API de Terceros (Limitadas):** Algunos portales inmobiliarios pueden tener APIs para socios o clientes empresariales, pero es poco probable que ofrezcan un acceso público y gratuito.

- **Recomendación:** El **web scraping** de los principales portales inmobiliarios es la estrategia recomendada para obtener datos del mercado de finca raíz.

## 4. Recomendaciones Finales

Para el desarrollo del sitio web "UBudget", recomiendo la siguiente combinación de herramientas y estrategias:

- **Precios de Acciones:**
  - **Primaria:** Utilizar la biblioteca **`yfinance`** de Python. Es gratuita, fácil de implementar y tiene una excelente cobertura para el mercado colombiano.
  - **Secundaria/Respaldo:** Registrarse para obtener una clave de API gratuita de **Alpha Vantage** o **Finnhub**. Esto proporciona una alternativa si `yfinance` deja de funcionar o si se necesitan más solicitudes de las que puede manejar.

- **Noticias Financieras:**
  - Utilizar la **API de News API**. Su plan gratuito es generoso y permite obtener noticias de negocios específicas de Colombia y en español, lo que es ideal para UBudget.

- **CDTs, Bonos y Finca Raíz:**
  - Implementar una solución de **web scraping** utilizando Python (con `BeautifulSoup` y `Requests`) para extraer datos de:
    - **CDTs:** Superintendencia Financiera de Colombia.
    - **Bonos:** Banco de la República de Colombia y Cbonds.
    - **Finca Raíz:** `fincaraiz.com.co` y otros portales inmobiliarios relevantes.
  - Complementar con la descarga y el procesamiento de conjuntos de datos de **Datos Abiertos Colombia**.

Esta combinación proporciona una base sólida y rentable para construir las características financieras de UBudget, aprovechando al máximo las herramientas gratuitas y las fuentes de datos públicas disponibles.

## Conclusión

La estrategia recomendada ofrece un enfoque pragmático y de múltiples niveles para la adquisición de datos para UBudget. Para los datos de acciones y noticias, las APIs bien documentadas y con generosos niveles gratuitos como `yfinance` y `News API` proporcionan una solución robusta y fácil de implementar. Para los instrumentos financieros más específicos de Colombia, como los CDTs, los bonos y los datos de finca raíz, es necesario un enfoque más práctico a través del web scraping. Aunque esto requiere un mayor esfuerzo de desarrollo inicial, ofrece la flexibilidad de obtener datos directamente de las fuentes primarias.

La implementación exitosa de estas recomendaciones permitirá a UBudget ofrecer a sus usuarios una visión completa y actualizada del panorama financiero, cumpliendo con todos los requisitos iniciales del proyecto.