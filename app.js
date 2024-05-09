const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let tareasPorHacer = [];
let tareasRealizadas = [];
let alerta;

app.get('/', (req, res) => {
    res.render('welcome-web.ejs', { tareasPorHacer, tareasRealizadas, alerta });
});


app.post('/agregar-tarea', (req, res) => {
    const nuevaTarea = req.body.tarea;
    if (nuevaTarea.trim() !== "") {
        const tareaExistente = tareasPorHacer.find(tarea => tarea === nuevaTarea.trim());
        if (!tareaExistente) {
            tareasPorHacer.push(nuevaTarea);
            alerta = ""; 
        } else {
            alerta = `La tarea ${nuevaTarea} ya existe en las tareas por hacer `;
            console.log("La tarea ya existe en el arreglo.");
        }
    }
    res.redirect('/');
});


app.post('/mover-a-realizadas', (req, res) => {
    let tareasMarcadas = req.body.tareasMarcadas;
    if (tareasMarcadas !== undefined) {
        console.log(tareasMarcadas)
        if (!Array.isArray(tareasMarcadas)) {
            tareasMarcadas = [tareasMarcadas];
        }
        if (tareasMarcadas) {
            tareasMarcadas.sort((a, b) => b - a);
            tareasMarcadas.forEach(index => {
                const tarea = tareasPorHacer.splice(index, 1)[0];
                tareasRealizadas.push(tarea);
            });
            alerta = ""; 
        }
    }
    res.redirect('/');
});


app.post('/eliminar-todas-realizadas', (req, res) => {
    tareasRealizadas = [];
    alerta = ""; 
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
