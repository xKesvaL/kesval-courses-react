function App() {
  return (
    <div className="min-h-screen flex flex-col container mx-auto py-12 gap-4">
      <header className="flex justify-between items-center text-4xl font-bold">
        Kanban UI
      </header>
      <main className="grid grid-cols-3 gap-4 grow">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">À Faire</h2>
          <div className="border rounded-lg grow p-4">
            <ul className="flex flex-col gap-4">
              <li className="border rounded-lg p-2">Tâche 1</li>
              <li className="border rounded-lg p-2">Tâche 3</li>
              <li className="border rounded-lg p-2">Tâche 4</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">En Cours</h2>
          <div className="border rounded-lg grow p-4">
            <ul className="flex flex-col gap-4">
              <li className="border rounded-lg p-2">Tâche 2</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Terminé</h2>
          <div className="border rounded-lg grow"></div>
        </div>
      </main>
      <footer className="text-right">
        <button
          type="button"
          className="bg-blue-500 text-white rounded-md px-4 py-2"
        >
          Ajouter une tâche
        </button>
      </footer>
    </div>
  );
}

export default App;
