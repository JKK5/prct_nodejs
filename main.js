const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const template = require('./lib/template.js')

const app = http.createServer(function(request, response){
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;
  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function (err, filelist){
        const title = 'Welcome';
        const desc = 'Hello, Node.js';
        const list = template.list(filelist);
        const html = template.html(title, list,
          `<a href="/create">create</a>`,
          `<h2>${title}</h2>${desc}`);
        response.writeHead(200);
        response.end(html);
      });
    } else {
      fs.readdir('./data', function(err, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, desc){
          const title = queryData.id;
          const list = template.list(filelist);
          const html = template.html(title, list,
            `<a href="/create">create</a>
            <a href="/update?id=${title}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}" />
              <input type="submit" value="delete" />
            </form>`,
            `<h2>${title}</h2>${desc}`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === '/create') {
    fs.readdir('./data', function(err, filelist){
      const title = 'WEB - create';
      const list = template.list(filelist);
      const html = template.html(title, list, '', 
        `<form action="/create_process" method="post">
          <p>
            <input type="text" name="title" placeholder="title" />
          </p>
          <p>
            <textarea name="desc" placeholder="desc"></textarea>
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>`
      );
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === '/create_process') {
    let body = '';
    request.on('data', function(data){
      body += data;
    });
    request.on('end', function(){
      const post = qs.parse(body);
      const title = post.title;
      const desc = post.desc;
      fs.writeFile(`data/${title}`, desc, 'utf8', function(err){
        response.writeHead(302, {location: `/?id=${title}`});
        response.end();
      });
    });
  } else if (pathname === '/update') {
    fs.readdir('./data', function(err, filelist){
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, desc){
        const title = queryData.id;
        const list = template.list(filelist);
        const html = template.html(title, list,
          `<a href="/create">create</a>
          <a href="/update?id=${title}">update</a>`,
          `<form action="/update_process" method="post">
            <p><input type="hidden" name="id" value="${title}" /></p>
            <p>
              <input type="text" name="title" placeholder="title" value="${title}" />
            </p>
            <p>
              <textarea name="desc" placeholder="desc">${desc}</textarea>
            </p>
            <p>
              <input type="submit" />
            </p>
          </form>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === '/update_process') {
    let body = '';
    request.on('data', function(data){
      body += data;
    });
    request.on('end', function(){
      const post = qs.parse(body);
      const id = post.id;
      const title = post.title;
      const desc = post.desc;
      fs.rename(`data/${id}`, `data/${title}`, function(err){
        fs.writeFile(`data/${title}`, desc, 'utf8', function(err){
          response.writeHead(302, {location: `/?id=${title}`});
          response.end();
        });
      });
    });
  } else if (pathname === '/delete_process') {
    let body = '';
    request.on('data', function(data){
      body += data;
    });
    request.on('end', function(){
      const post = qs.parse(body);
      const id = post.id;
      fs.unlink(`data/${id}`, function(err){
        response.writeHead(302, {location: `/`});
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end('404 Not found');
  }
});
app.listen(3000);