import React from 'react'
import App from './App.js'

export default props => (
  <App>
    <h1 className='mv0'>operator.js<span className='h6 cb ml1'>v3.4.1</span></h1>

    <div className='outer-v'>
      <p className='h4'>A drop-in "PJAX" solution for fluid, smooth transitions between pages. <strong>2.87kb gzipped.</strong> Zero stress.</p>

      <a href='/usage' className='button mt05 mb05' role='button'>Usage</a>
      <a href='https://github.com/estrattonbailey/operator.js' className='button button--outline mt05 mb05 ml1' role='button'>GitHub</a>

      <hr className='mv1 s3 cg' />

      <h4 className='caps mb05'>Features:</h4>
      <ul className='list'>
        <li>Simple config</li>
        <li>Easily handle transitions with CSS</li>
        <li>Pages are cached after initial visit</li>
        <li>Pre-cache select pages, as needed</li>
        <li>Parametized routes</li>
        <li>Async-by-default, easy data loading between routes</li>
        <li>Manages scroll position between route changes</li>
      </ul>
    </div>
  </App>
)
