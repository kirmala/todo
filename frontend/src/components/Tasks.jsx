import React, { useState, useEffect } from "react";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) {
      setError("Task description cannot be empty.");
      return;
    }
    setTasks([...tasks, { description: newTask, done: false }]);
    setNewTask("");
    setError("");
  };

  const updateTask = (index, updatedTask) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], ...updatedTask };
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">TO-DO List</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="flex mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task..."
            className="flex-1 border px-3 py-2 rounded-l-md"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {tasks.length === 0 && <p className="text-gray-500 text-center">No tasks</p>}

        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => updateTask(index, { done: !task.done })}
                />
                <input
                  type="text"
                  value={task.description}
                  onChange={(e) =>
                    updateTask(index, { description: e.target.value })
                  }
                  className={`border px-2 py-1 rounded-md ${
                    task.done ? "line-through text-gray-400" : ""
                  }`}
                />
              </div>
              <button
                onClick={() => deleteTask(index)}
                className="text-red-500 font-bold px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
