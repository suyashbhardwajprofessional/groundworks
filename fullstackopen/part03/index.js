// console.log('hello world');
let notes = [
  {
    id: "1",
    content: "HTML is easy? really?",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

// const http = require('http');
// const app = http.createServer((request,response)=>{
// 	/*response.writeHead(200, { 'Content-Type':'text/plain' });
// 	response.end('hello world')*/
// 	response.writeHead(200, { 'Content-Type': 'application/json' })
//   	response.end(JSON.stringify(notes))
// })

const express = require('express');
const app = express();

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.get('/',(request,response)=>{
	response.send('<h2>hello world</h2>')
})

app.get('/api/notes', (request, response) => {
	response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
	const id = request.params.id;
	const note = notes.find(note => note.id === id)
	if(note)
	response.json(note)
	else 
	response.status(404).end()
})

app.delete('/api/notes/:id', (request, response) => {
	const id = request.params.id;
	notes = notes.filter(note => note.id !== id)
	response.status(204).end();
})

app.use(express.json());
app.post('/api/notes', (request, response) => {
	// const note = request.body;
	// console.log(note);
	// response.json(note);

	const body = request.body
    if(!body.content) {
	    return response.status(400).json({ 
	      error: 'content missing' 
	    })
	}

	const note = {
	    content: body.content,
	    important: Boolean(body.important) || false,
	    id: generateId(),
	}

  	notes = notes.concat(note)
  	response.json(note)
})

const PORT = 3001
// app.listen(PORT)
app.listen(PORT, ()=>{
	console.log(`server running on port ${PORT}`);
})