module.exports = {
  output: './public',
  pages: [
    {
      template: './app/markup/Home.js', 
      route: '/'
    },
    {
      template: './app/markup/Usage.js', 
      route: '/usage'
    }
  ]
}
