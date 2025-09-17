import React, { useState, useEffect } from "react";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");
  const [importError, setImportError] = useState("");

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

  // Export tasks to a JSON file
  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = "tasks.json";
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Import tasks from a JSON file
  const importTasks = (event) => {
    setImportError("");
    
    const fileReader = new FileReader();
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Check if the file is JSON
    if (file.type !== "application/json") {
      setImportError("Please select a JSON file.");
      return;
    }
    
    fileReader.readAsText(file, "UTF-8");
    
    fileReader.onload = (e) => {
      try {
        const content = e.target.result;
        const importedTasks = JSON.parse(content);
        
        // Validate the imported data structure
        if (!Array.isArray(importedTasks)) {
          setImportError("Invalid file format: expected an array of tasks.");
          return;
        }
        
        // Basic validation for each task
        const isValid = importedTasks.every(task => 
          typeof task === "object" && 
          "description" in task && 
          "done" in task
        );
        
        if (!isValid) {
          setImportError("Invalid task structure in the file.");
          return;
        }
        
        // Replace current tasks with imported ones
        setTasks(importedTasks);
        
        // Clear the file input
        event.target.value = "";
      } catch (error) {
        setImportError("Error parsing JSON file. Please check the file format.");
      }
    };
    
    fileReader.onerror = () => {
      setImportError("Error reading file.");
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">TO-DO List</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {importError && <p className="text-red-500 mb-4">{importError}</p>}
      
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

        {/* Import/Export buttons */}
        <div className="flex justify-between mb-4">
          <div className="relative">
            <input
              type="file"
              id="importFile"
              accept=".json"
              onChange={importTasks}
              className="hidden"
            />
            <label
              htmlFor="importFile"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer"
            >
              Import Tasks
            </label>
          </div>
          
          <button
            onClick={exportTasks}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
          >
            Export Tasks
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