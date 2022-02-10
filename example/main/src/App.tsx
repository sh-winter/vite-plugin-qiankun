import { useEffect, createRef } from 'react'
import { registerMicroApps, setDefaultMountApp, start } from 'qiankun'
import logo from './logo.svg'
import './App.css'

function App () {
  const microAppContainerRef = createRef<HTMLDivElement>()

  useEffect(() => {
    if (!microAppContainerRef.current) return

    registerMicroApps([
      {
        name: 'micro-app-vue',
        entry: `${location.protocol}//localhost:5000/micro-app-vue`,
        container: microAppContainerRef.current,
        activeRule: '/micro-app-vue'
      }
    ])

    setDefaultMountApp('/micro-app-vue')

    start({
      // fetch: async (input) => {
      //   const response = await fetch(input);
      //   if (!isHTML(response)) return response;
      //   const text = await response.text();
      //   if (!text.endsWith(`<!-- VITE -->`)) return new Response(text);

      //   const newText = text
      //     .replaceAll(
      //       /\<link rel=\"modulepreload\" href=\"(.*?)\"\>/g,
      //       `<link rel="modulepreload" href="${new URL(typeof input === 'string' ? input : input.url).origin}$1">`
      //     )
      //     .replaceAll(
      //       /\<script crossorigin=\"\"\>import\(\'(.*?)\'\)\.finally/g,
      //       `<script crossorigin="">import('${new URL(typeof input === 'string' ? input : input.url).origin}$1').finally`
      //     );
      //   return new Response(newText)
      // }
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>qiankun-main-app</p>
      </header>
      <div className="App-body">
        <div className="Micro-app-container" ref={microAppContainerRef}></div>
      </div>
    </div>
  )
}

export default App
