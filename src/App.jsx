import { useState } from "react";
import { tasks as importedTasks } from "./tasks";
import { Column } from "./Column";
import { Modal } from "./Modal";

function App() {
  const [tasks, setTasks] = useState(importedTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tasksByStatus = {};

  tasks.forEach((task) => {
    if (tasksByStatus[task.status]) {
      tasksByStatus[task.status].push(task);
    } else {
      tasksByStatus[task.status] = [task];
    }
  });

  console.log(tasksByStatus);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const form = Object.fromEntries(formData.entries());
    const newTask = {
      id: tasks.length + 1,
      title: form.title,
      description: form.description,
      status: form.status,
    };
    setTasks([...tasks, newTask]);
    e.target.reset();
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col container mx-auto py-12 gap-4">
      <header className="flex justify-between items-center text-4xl font-bold">
        Kanban UI
      </header>
      <main className="grid grid-cols-3 gap-4 grow">
        {Object.entries(tasksByStatus).map(([status, tasks]) => {
          return <Column key={status} status={status} tasks={tasks} />;
        })}
      </main>
      <footer className="text-right">
        <Modal isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Titre"
              className="border rounded-md px-4 py-2 mr-2"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              className="border rounded-md px-4 py-2 mr-2"
            />
            <select name="status" className="border rounded-md px-4 py-2 mr-2">
              <option value="todo">À faire</option>
              <option value="in_progress">En cours</option>
              <option value="done">Terminé</option>
            </select>
            <button
              type="button"
              className="bg-blue-500 text-white rounded-md px-4 py-2"
            >
              Ajouter
            </button>
          </form>
        </Modal>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white rounded-md px-4 py-2"
        >
          Ajouter une tâche
        </button>
      </footer>
    </div>
  );
}

export default App;
