import { useState } from "react";
import { Column } from "./Column";
import { Modal } from "./Modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authClient } from "./lib/auth-client";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = authClient.useSession();
  console.log(session);

  const { data, refetch } = useQuery({ 
    queryKey: ['tasks'], 
    queryFn: () => fetch('/api/tasks').then(res => res.json()) 
  });

  const { mutate } = useMutation({
    mutationFn: (task) => fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task)
    }),
    onSuccess: () => {
      refetch();
    }
  });

  const tasks = data?.data;

  const tasksByStatus = tasks?.reduce((acc, task) => {
    acc[task.status] = acc[task.status] || [];
    acc[task.status].push(task);
    return acc;
  }, {})

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
    mutate(newTask);
    e.target.reset();
    setIsModalOpen(false);
  };

  const handleSignInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: 'http://localhost:5173/'
    })
  }

  return (
    <div className="min-h-screen flex flex-col container mx-auto py-12 gap-4">
      <header className="flex justify-between items-center text-4xl font-bold">
        Kanban UI
      </header>
      <main className="grid grid-cols-3 gap-4 grow">
        {tasksByStatus && Object.entries(tasksByStatus).map(([status, tasks]) => {
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
              type="submit"
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
        <button type="button" 
          onClick={handleSignInWithGoogle}
        >
          Se connecter
        </button>
      </footer>
    </div>
  );
}

export default App;
