import React from 'react'

export default props => (
  <html>
    <head>
      <link href="https://fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet" />
      <link href="https://unpkg.com/svbstrate" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.9.0/github-markdown.min.css" rel="stylesheet" />
      <link rel='stylesheet' type='text/css' href='/main.css' />
      <title>Operator</title>
    </head>
    <body>
      <main>
        <div className='container mxa'>
          <h1>operator.js</h1>

          <div className='content markdown-body' data-component='readme'>
          </div>
        </div>
      </main>

      <script src='/index.js'></script>
    </body>
  </html>
)
