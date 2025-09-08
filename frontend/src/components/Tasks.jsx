import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState({
    description: '',
    status: 'not completed',
  });

  const fetchTasks = async () => {
    try {
      const task = await axios.get('/tasks.json')
      setTasks(tasks);
      setError('')
    } catch (err) {
      setError('Failed to load tasks.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/tasks',
        newTask,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      fetchTasks()
      setNewTask({ title: '', description: '', due_date: '', status: 'not comleted'});
      setIsCreating(false);
    } catch (err) {
      setError('Failed to create a new task.');
    }
  };


  const handleUpdate = async (taskID, updatedTask) => {
    try {
      await axios.put(
        `http://localhost:8080/tasks/${taskID}`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      fetchTasks();
    } catch (err) {
      setError('Failed to update the task.');
    }
  };

  const handleDelete = async (taskID) => {
    try {
      await axios.delete(`http://localhost:8080/tasks/${taskID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      fetchTasks();
    } catch (err) {
      setError('Failed to delete the task.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
      {tasks.map((task) => {
        const isOverdue = new Date(task.due_date) < new Date();
        return (
          <div
            key={task.ID}
            className={`flex flex-col md:flex-row justify-between items-center border-b border-gray-200 py-4 ${
              isOverdue && task.status !== 'completed' ? 'bg-red-100' : ''
            }`}
          >
            <div className="w-full md:w-1/3">
              <input
                type="text"
                defaultValue={task.title}
                onBlur={(e) =>
                  handleUpdate(task.ID, { ...task, title: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
              />
            </div>
            <div className="w-full md:w-1/3">
              <input
                type="text"
                defaultValue={task.description}
                onBlur={(e) =>
                  handleUpdate(task.ID, { ...task, description: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
              />
            </div>
            <div className="w-full md:w-1/6">
              <input
                type="date"
                defaultValue={task.due_date}
                onBlur={(e) =>
                  handleUpdate(task.ID, { ...task, due_date: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="w-full md:w-1/6">
              <select
                defaultValue={task.status}
                onBlur={(e) =>
                  handleUpdate(task.ID, { ...task, status: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="not completed">Not Completed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                onClick={() => handleDelete(task.ID)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
        {isCreating ? (
          <form
            onSubmit={handleCreateTask}
            className="mt-6 w-full max-w-2xl bg-white p-4 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              required
            />
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              required
            />
            <input
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              required
            />
            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              required
              >
              <option value="not completed">Not Completed</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Create
              </button>
            </div>
          </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Create Task
        </button>
      )}
      </div>
    </div>
  );
};

export default Tasks;