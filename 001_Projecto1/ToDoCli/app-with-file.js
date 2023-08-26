import { readFileSync, writeFileSync } from "fs"; // import para la sincronizacion
import { createInterface } from "readline";
import chalk from "chalk";

const tasks = [];
const DB_FILE = "tasks.txt";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function displayMenu() {
  console.log(chalk.yellow.bold("🦊🦊🦊🦊🦊 To Do App 🦊🦊🦊🦊🦊"));
  console.log(chalk.blueBright("Menu de Opciones:"));
  console.log("1. Agregar tarea");
  console.log("2. Listar tareas");
  console.log("3. Completar tarea");
  console.log("4. Salir");
  console.log("\n");
}

// esta es para cargar la lectura del archivo loadTasks() {
function loadTasks() {
  try {
    const data = readFileSync(DB_FILE, "utf-8"); 
    const lines = data.split("\n"); // leer las lineas de archivo y se separa po un enter y un salto de linea
    tasks.length = 0;

    lines.forEach((line) => {
      if (line.trim() !== "") {
        const [task, completed] = line.split("|");
        tasks.push({ task, completed: completed === true });
      }
    });

    console.log(chalk.green.bold("Las tareas se han cargado desde la BD\n"));
  } catch (err) {
    console.log(chalk.green.bold("No hay tareas por hacer 😀👌🏻\n"));
  }
}

// esta function  es para salvar la Tarea 
function saveTask() {
  //data hace um mapeo
  const data = tasks.map((task) => `${task.task}|${task.completed}`).join("\n");
  writeFileSync(DB_FILE, data, "utf-8");
  console.log(chalk.green.bold("Tarea agregada a la BD con éxito\n"));
}

function addTask() {
  rl.question(chalk.bgMagentaBright("Escribe la tarea: "), (task) => {
    tasks.push({ task, completed: false });
    console.log(chalk.green.bold("Tarea agregada con éxito\n"));
    saveTask();
    displayMenu();
    chooseOption();
  });
}

function listsTasks() {
  console.log(chalk.yellow.bold("\n🦊🦊🦊🦊🦊 Tareas 🦊🦊🦊🦊🦊\n"));

  if (tasks.length === 0) {
    console.log(chalk.green.bold("No hay tareas por hacer 😀👌🏻\n"));
  } else {
    tasks.forEach((task, index) => {
      let status = task.completed ? "✅" : "❌";

      if (task.completed) {
        console.log(
          chalk.greenBright(`${index + 1}. ${status} - ${task.task}`)
        );
      } else {
        console.log(chalk.redBright(`${index + 1}. ${status} - ${task.task}`));
      }
    });
  }

  displayMenu();
  chooseOption();
}

function completeTask() {
  rl.question(
    chalk.bgMagentaBright("Digita el número de la tarea a completar: "),
    (taskNumber) => {
      const index = parseInt(taskNumber) - 1;
      if (index >= 0 && index < tasks.length) {
        tasks[index].completed = true;
        saveTask();
        console.log(chalk.green.bold("Tarea marcada con exito ✅\n"));
      } else {
        console.log(chalk.red.bold("Número de tarea inválido \n"));
      }
      displayMenu();
      chooseOption();
    }
  );
}

function chooseOption() {
  rl.question("Digita el número de tu opción:", (choice) => {
    switch (choice) {
      case "1":
        addTask();
        break;
      case "2":
        listsTasks();
        break;
      case "3":
        completeTask();
        break;
      case "4":
        4;
        console.log(chalk.yellow("Adiós 👋🏻🦊"));
        rl.close();
        break;
      default:
        console.log(chalk.red("Opción Inválida, Intenta nuevamente \n"));
        displayMenu();
        chooseOption();
        break;
    }
  });
}

loadTasks();
displayMenu();
chooseOption();
