const fs = require("fs");
const path = require("path");

const TASK_FILE = path.join(__dirname, "task.txt");
const COMPLETED_FILE = path.join(__dirname, "completed.txt");

function printUsage() {
  console.log("Usage :-");
  console.log(
    '$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list'
  );
  console.log(
    "$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order"
  );
  console.log(
    "$ ./task del INDEX            # Delete the incomplete item with the given index"
  );
  console.log(
    "$ ./task done INDEX           # Mark the incomplete item with the given index as complete"
  );
  console.log("$ ./task help                 # Show usage");
  console.log("$ ./task report               # Statistics");
}
function readfilecontent() {
  try {
    const fileContent = fs.readFileSync(TASK_FILE, "utf8");
    const lines = fileContent.split("\n").filter(Boolean);
    return lines;
  } catch (error) {
    console.error("Error reading file:", error);
    return [];
  }
}

function addTask(priority, task) {
  if (!task) {
    console.log("Error: Missing tasks string. Nothing added!");
    return; // Exit the function if no task is provided
  } else if (priority >= 0) {
    const taskLine = `${priority} ${task}\n`;
    fs.appendFileSync(TASK_FILE, taskLine);
    console.log(`Added task: "${task}" with priority ${priority}`);
  } else {
    console.log("Error:priority should be greater then or equal to zero");
  }
}

function listtasks() {
  const tasks = readfilecontent();
  if (tasks.length > 0) {
    const sortedTasks = tasks
      .map((line) => {
        const priority = line.split(" ", 1)[0];
        const task = line.substring(line.indexOf(" ") + 1);
        return [priority, task];
      })
      .sort((a, b) => a[0] - b[0])
      .map(([priority, task]) => `${task} [${priority}]`);

    sortedTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task}`);
    });
  } else {
    console.log("There are no pending tasks!");
  }
}

function DeleteTask(index) {
  let tasks = readfilecontent();
  if (index >= 1 && index <= tasks.length) {
    tasks.splice(index - 1, 1);
    fs.writeFileSync(TASK_FILE, tasks.join("\n") + "\n");
    console.log(`Deleted task #${index}`);
  } else if (isNaN(index)) {
    console.log(`Error: Missing NUMBER for deleting tasks.`);
  } else {
    console.log(
      `Error: task with index #${index} does not exist. Nothing deleted.`
    );
  }
}
function markTaskDone(index) {
  let tasks = readfilecontent();
  if (index >= 1 && index <= tasks.length) {
    const task = tasks[index - 1];
    tasks.splice(index - 1, 1);
    fs.writeFileSync(TASK_FILE, tasks.join("\n") + "\n", "utf8");
    fs.appendFileSync(COMPLETED_FILE, `${task}\n`);
    console.log("Marked item as done.");
  } else if (isNaN(index)) {
    console.log("Error: Missing NUMBER for marking tasks as done.");
  } else {
    console.log(`Error: no incomplete item with index #${index} exists.`);
  }
}

function generateReport() {
  const tasks = readfilecontent();
  const completedTasks = fs
    .readFileSync(COMPLETED_FILE, "utf8")
    .split("\n")
    .filter(Boolean);
  console.log("Pending :", tasks.length);
  tasks.forEach((task, index, priority) => {
    const priority1 = task.split(" ", 1)[0];
    const task1 = task.substring(task.indexOf(" ") + 1);
    console.log(`${index + 1}. ${task1} [${priority1}]`);
  });

  console.log("\nCompleted :", completedTasks.length);
  completedTasks.forEach((task, index) => {
    const task1 = task.substring(task.indexOf(" ") + 1);
    console.log(`${index + 1}. ${task1}`);
  });
}

function taskmanager() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "add":
      const priority = parseInt(args[1], 10);
      const task = args.slice(2).join(" ");
      addTask(priority, task);
      break;
    case "ls":
      listtasks();
      break;
    case "del":
      const deleteIndex = parseInt(args[1], 10);
      DeleteTask(deleteIndex);
      break;
    case "done":
      const doneIndex = parseInt(args[1], 10);
      markTaskDone(doneIndex);
      break;
    case "help":
      printUsage();
      break;
    case "report":
      generateReport();
      break;
    default:
      printUsage();
      break;
  }
}

taskmanager();
