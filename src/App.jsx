import { useEffect, useState } from "react";
import { Column } from "./Column";
import { Modal } from "./Modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authClient } from "./lib/auth-client";
import { socket } from "./lib/socket";
import { queryClient } from "./main";

function App() {
  socket.connect();
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

  const { data: messages } = useQuery({
    queryKey: ['messages'],
    queryFn: () => fetch('/api/messages').then(res => res.json()),
    select: (data) => data.data
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const form = Object.fromEntries(formData.entries());
    socket.emit('sendMessage', {
      message: form.message,
      senderId: "jordan",
    });
    e.target.reset();
  }

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      console.log(message);
      queryClient.setQueriesData(['messages'], (oldData) => {
        return {
          success: true,
          data: [...oldData.data, message],
        }
      })
    });

    return () => {
      socket.off('receiveMessage');
    }
  }, []);


  return (
    <div className="min-h-screen flex flex-col container mx-auto py-12 gap-4">
      <header className="flex justify-between items-center text-4xl font-bold">
        Kanban UI
      </header>
      <main>
        <section className="min-h-[60vh] flex flex-col gap-4">
          <h2>Chat</h2>
          <div className="shadow-xs grow flex flex-col gap-2 border rounded-md p-4">
            {messages?.map((message) => (
              <div key={message.id}>{message.content}</div>
            ))}
            <form onSubmit={handleSendMessage} className="flex gap-2 items-center mt-auto w-full">
              <input name="message" type="text" placeholder="Message" className="w-full border rounded-md px-4 py-2 mr-2" />
              <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">Envoyer</button>
            </form>
          </div>
        </section>
      <section className="grid grid-cols-3 gap-4 grow">
        {tasksByStatus && Object.entries(tasksByStatus).map(([status, tasks]) => {
          return <Column key={status} status={status} tasks={tasks} />;
        })}
      </section>
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
