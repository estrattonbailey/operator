import React from 'react'

export default props => (
  <html>
    <head>
      <link rel='stylesheet' type='text/css' href='/main.css' />
      <title>Operator</title>
    </head>
    <body>
      <header className='outer bgg'>
        <nav className='f aic fw outer-h'>
          <a href='/' className='mr1 b caps h6'>Home</a>
          <a href='/usage' className='mr1 b caps h6'>Usage</a>
          <a href='/advanced' className='mr1 b caps h6'>Advanced</a>
          <a href='/faq' className='mr1 b caps h6'>FAQ</a>
        </nav>
      </header>
      <div className='outer-h outer-b bgg'>
        <main className='bgw'>
          <div className='container'>
            <div className='outer' id='root'>
              {props.children}
            </div>
          </div>
        </main>
      </div>

      <script src='/index.js'></script>
    </body>
  </html>
)
