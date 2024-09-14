#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
// import TerminalInterface from "./TerminalInterface";

// write(chalk.bgGreen("hi mom"));

let playername: string;

const sleep = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function welcome(): Promise<void> {
  const rainbowTitle = chalkAnimation.rainbow(
    "============This is the menu============\n"
  );
  await sleep();
  rainbowTitle.stop();
  write(`
    ${chalk.bgBlue("WHAT TO DO")}
    this is a description
    ffffffffffffffffffffffffffff ${chalk.bgRed("aaaa")}
  `);
}

async function ask(msg: string, def: string = "Player"): Promise<string> {
  const answers = await inquirer.prompt({
    name: "player_name",
    type: "input",
    message: msg,
    default() {
      return def;
    },
  });

  // playername = answers.player_name;
  return answers.player_name;
}

async function prompt(msg: string): Promise<string> {
  const answers = await inquirer.prompt({
    name: "player_name",
    type: "input",
    message: msg,
    default() {
      return "";
    },
  });

  return answers.player_name;
}

async function question(choices: string[]): Promise<void> {
  const answers = await inquirer.prompt({
    name: "question1",
    type: "list",
    message: "Booted up\n",
    choices: choices,
  });

  return handleLogin(answers.question1);
}

class User {
  constructor(public name: string, public password: string) {}
}

const users: User[] = [];

users.push(new User("Player", "Player"));

async function handleLogin(option: string): Promise<void> {
  const spinner = createSpinner("Checking answer...").start();
  await sleep();

  if (option == "login") {
    spinner.success({ text: `Provide name and password` });
    let name = await ask("Enter Username here:");
    // write(name);
    let password = await ask("Enter Password here:");
    // write(password);
    let user = new User(name, password);
    // write(user);
    if (
      users.some((u) => {
        return u.name == user.name && u.password == user.password;
      })
    ) {
      spinner.success({ text: `Found ${user.name}` });
      terminal(user);
    }
  } else if (option == "new account") {
    spinner.success({ text: `Provide name and password` });
    let name2 = chalk.bgGreen(" " + (await ask("Enter Username here:")) + " ");
    let password2 = chalk.bgGreen(
      " " + (await ask("Enter Password here:")) + " "
    );
    let user = new User(name2, password2);
    if (
      users.find((u) => {
        u = user;
      })
    ) {
      write("that user already exist");
    } else {
      users.push(user);
    }
  } else if (option == "game") {
    spinner.success({ text: `Enjoy` });
    game();
  } else {
    spinner.error({ text: `💀💀💀 Goodbye` });
    process.exit(1);
  }
}

async function welcome_user(): Promise<void> {
  console.clear();
  const msg = `TS-cli`;

  figlet(msg, (err, data) => {
    if (err) {
      write("Something went wrong...");
      console.dir(err);
      return;
    }
    // Call `multiline` to apply gradient to the figlet output
    write(gradient.vice.multiline(data));
  });
}

class Folder {
  // Tenga en cuenta que una carpeta puede contener carpetas y archivos.
  public content: (File | Folder)[] = [];
  public prevDir: Folder;

  constructor(public name: string) {}

  addFile(file: File) {
    this.content.push(file);
  }

  addFolder(folder: Folder) {
    this.content.push(folder);
  }

  getFolder(name: string): Folder | undefined {
    return this.content.find(
      (item) => item instanceof Folder && item.name === name
    ) as Folder | undefined;
  }

  getFile(name: string): File | undefined {
    return this.content.find(
      (item) => item instanceof File && item.name === name
    ) as File | undefined;
  }
}

class File {
  constructor(public name: string, public content: string = "") {}

  // Method to get the file's content
  getContent(): string {
    return this.content;
  }

  // Method to set the file's content
  setContent(newContent: string): void {
    this.content = newContent;
  }
}

async function terminal(user: User) {
  await welcome_user();
  await sleep(500);
  const spinner = createSpinner(
    user.name + "@tscli ... write help or -h for help"
  ).start();
  spinner.success();
  // El sistema de archivos cuenta con una carpeta root la cual puede contener archivos o carpetas.
  const root = new Folder("~/");
  let currentDir: Folder = root;
  let pwd = currentDir.name;
  let symbol = ">:";
  let history: string[] = [];

  while (true) {
    let input = await prompt(pwd + " " + symbol);
    history.push(input);
    let command = input.split(" ");

    // write(command);
    switch (command[0]) {
      case "-h" || "help":
        {
          write(
            " * mkdir : crea una carpeta. \n * touch : crea un archivo.\n * cd : permite entrar en una carpeta.\n * ls: lista todos los archivos y carpetas que contiene la carpeta ordenados por nombre.\n * lsp: lista todo los archivos y los guarda en un archivo de texto “display.txt” \n * pwd: Indica el path donde nos encontramos."
          );
        }
        break;
      case "mkdir":
        if (typeof command[1] === "string") {
          if (!(await noRepeat(command[1], currentDir))) {
            let new_folder = new Folder(command[1]);
            new_folder.prevDir = currentDir;
            currentDir.addFolder(new_folder);
          } else {
            spinner.error({
              text: `folder or file ${command[1]} already exist`,
            });
          }
        } else {
          spinner.error({ text: `Expecify a name` });
        }
        break;
      case "touch":
        if (typeof command[1] === "string") {
          if (!(await noRepeat(command[1], currentDir))) {
            let new_file = new File(command[1]);
            if (typeof command[2] === "string") {
              new_file.setContent(command[2]);
            }
            currentDir.addFile(new_file);
          } else {
            if (typeof command[2] === "string") {
              currentDir.getFile(command[1]).setContent(command[2]);
            }
          }
        } else {
          spinner.error({ text: `Expecify a name` });
        }
        break;
      case "cd":
        if (typeof command[1] === "string") {
          if (command[1] == "..") {
            if (currentDir != root) {
              currentDir = currentDir.prevDir;
              const parts = pwd.split("/").filter((part) => part.length > 0);
              pwd = parts.slice(0, -1).join("/") + "/";
            }
          }
          currentDir.content.forEach((item) => {
            if (item instanceof Folder) {
              if (command[1] === item.name) {
                currentDir = item;
                pwd += currentDir.name + "/";
              }
            }
          });
        } else {
          write("Unknown path");
        }
        break;
      case "ls":
        if (currentDir != root) {
          write(chalk.green(".."));
        }
        currentDir.content.forEach((f) => {
          if (f instanceof Folder) {
            write(chalk.green(f.name));
          } else {
            write(chalk.yellow.italic(f.name));
          }
        });
        break;
      case "lsp":
        const filesList = currentDir.content.map((f) => f.name);

        // Unir los nombres en una sola cadena, separada por saltos de línea
        const filesText = filesList.join("\n");
        currentDir.addFile(new File("display.txt", filesText));
        break;
      case "pwd":
        write(chalk.green(pwd));
        break;
      case "cat":
        if (typeof command[1] === "string" && currentDir.getFile(command[1])) {
          write(currentDir.getFile(command[1]).getContent());
        } else {
          spinner.error({ text: `File does't exist` });
        }
        break;
      case "clear":
        console.clear();
        break;
      case "exit":
        spinner.error({ text: `Goodbye` });
        process.exit(1);
      default:
        write("Unknown command");
        break;
    }
  }
}

async function noRepeat(name: string, folder: Folder): Promise<boolean> {
  // Los archivos y carpetas cuentan con un path que debe ser único, dado que una carpeta no puede contener 2 archivos con el mismo nombre.
  if (
    folder.content.find((x) => {
      return x.name == name;
    })
  ) {
    return true;
  }
  return false;
}

async function write(message: string): Promise<void> {
  message.split("\n").forEach((line) => console.log(line));
}

console.log(chalk.bgGreen("hi mom"));

async function askName(): Promise<void> {
  const answers = await inquirer.prompt({
    name: "player_name",
    type: "input",
    message: "What is thou name?",
    default() {
      return "Player";
    },
  });

  playername = answers.player_name;
}

async function question1(): Promise<void> {
  const answers = await inquirer.prompt({
    name: "question1",
    type: "list",
    message: "Javascript was created in 10 days and released on\n",
    choices: [
      "May 23rd, 1995",
      "Nov 24th, 1995",
      "Dec 4th, 1995",
      "Dec 17, 1996",
    ],
  });

  return handleAnswer(answers.question1 === "Dec 4th, 1995");
}

async function handleAnswer(isCorrect: boolean): Promise<void> {
  const spinner = createSpinner("Checking answer...").start();
  await sleep();

  if (isCorrect) {
    spinner.success({ text: `Nice work ${playername}` });
  } else {
    spinner.error({ text: `💀💀💀 Game over, you lose ${playername}` });
    process.exit(1);
  }
}

async function winner(): Promise<void> {
  console.clear();
  const msg = `Nice work \n ${playername}`;
  figlet(msg, (err, data) => {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    // Call `multiline` to apply gradient to the figlet output
    console.log(gradient.vice.multiline(data));
  });
}

async function game() {
  await welcome();
  await askName();
  await question1();
  await winner();
  await sleep(500);
  process.exit(1);
}

console.clear();
question(["login", "new account", "game", "Goodbye"]);
