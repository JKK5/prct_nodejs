module.exports = {
  html: function (title, list, control, body) {
    return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
      </body>
    </html>    
    `;
  }, list: function (filelist) {
    let list = '<ul>';
    for (let i = 0; i < filelist.length; i++) {
      list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    }
    list += '</ul>';
    return list;
  }
}