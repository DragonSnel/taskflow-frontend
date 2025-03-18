import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const API_URL = "http://localhost:5000/api/tasks";
const TRASH_API_URL = "http://localhost:5000/api/trash";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [trash, setTrash] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchTrash();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchTrash = async () => {
    try {
      const response = await axios.get(TRASH_API_URL);
      setTrash(response.data);
    } catch (error) {
      console.error("Error fetching trash:", error);
    }
  };

  const addTask = async () => {
    if (!title || !description) {
      alert("Please enter a title and description!");
      return;
    }
    try {
      const response = await axios.post(API_URL, { title, description });
      setTasks([...tasks, response.data]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchTasks();
        fetchTrash();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const clearTrash = async () => {
    if (window.confirm("Are you sure you want to clear the trash?")) {
      try {
        await axios.delete(TRASH_API_URL);
        fetchTrash();
      } catch (error) {
        console.error("Error clearing trash:", error);
      }
    }
  };

  const restoreTask = async (id) => {
    try {
      await axios.post(`${TRASH_API_URL}/restore/${id}`);
      fetchTasks();
      fetchTrash();
    } catch (error) {
      console.error("Error restoring task:", error);
    }
  };

  const deleteTaskPermanently = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this task?")) {
      try {
        await axios.delete(`${TRASH_API_URL}/${id}`);
        fetchTrash();
      } catch (error) {
        console.error("Error permanently deleting task:", error);
      }
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h2>📋 Task Manager</h2>
        <div className="trash-icon" onClick={() => setIsTrashOpen(true)}>
          <i className="fas fa-trash-alt"></i>
        </div>
      </header>

      <div className="input-group">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button onClick={addTask}>➕ Add</button>
      </div>

      <h3>📌 Active Tasks</h3>
      <table className="task-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <button className="delete-btn" onClick={() => deleteTask(task.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isTrashOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsTrashOpen(false)}>&times;</span>
            <h3>🗑 Trash</h3>
            <button className="clear-trash" onClick={clearTrash}>Clear Trash</button>
            <table className="task-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {trash.map((task) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>
                      <button className="restore-btn" onClick={() => restoreTask(task.id)}>♻️</button>
                      <button className="delete-btn" onClick={() => deleteTaskPermanently(task.id)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
