import "./App.css";
import { Button, Modal } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function App() {
  const [newTask, setNewTask] = useState("");
  const [taskDeadline, setTaskDeadline] = useState(new Date());
  const [todos, setTodos] = useState(() => {
    const localValue = localStorage.getItem("TASK");
    if (localValue == null) return [];
    return JSON.parse(localValue);
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [allMarkedDone, setAllMarkedDone] = useState(false);

  useEffect(() => {
    localStorage.setItem("TASK", JSON.stringify(todos));
    setAllMarkedDone(todos.length > 0 && todos.every(todo => todo.completed));
  }, [todos]);

  function handleSubmit(e) {
    e.preventDefault();
    if (newTask === "" || !taskDeadline) return;
    if (editingTaskId) {
      // Update the existing task
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === editingTaskId ? { ...todo, title: newTask, deadline: taskDeadline } : todo
        )
      );
      setEditingTaskId(null);
    } else {
      // Add a new task
      setTodos((currentTodos) => [
        ...currentTodos,
        { id: crypto.randomUUID(), title: newTask, completed: false, deadline: taskDeadline },
      ]);
    }
    setNewTask("");
    setTaskDeadline(new Date());
    setShowModal(false);
  }

  function toggleTodo(id, completed) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== id)
    );
  }

  function deleteAllTodos() {
    setTodos([]);
  }

  function toggleAllTodos() {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => ({ ...todo, completed: !allMarkedDone }))
    );
    setAllMarkedDone(!allMarkedDone);
  }

  function startEditing(id, title, deadline) {
    setEditingTaskId(id);
    setNewTask(title);
    setTaskDeadline(new Date(deadline));
    setShowModal(true);
  }

  function toggleTaskStatus(id) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  return (
    <>
      <header>
        <img className="logo" src="./main-white.png" alt="Logo" />
        <img className="profile" src="./profile.png" alt="Profile" />
      </header>

      <main>
        <div className="apptitle roboto-slab">INTERN'S TO-DO LIST</div>
        <div className="bg_wrapper">
          <div className="bg">
            <div className="addTask">
              <form onSubmit={handleSubmit} className="task">
                <div className="form-row">
                  <label htmlFor="item"></label>
                  <input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    type="text"
                    id="item"
                    className="taskInput"
                    placeholder="Add or edit task here..."
                  />
                  <DateTimePicker
                    onChange={setTaskDeadline}
                    value={taskDeadline}
                  />
                </div>
                <div className="form-row">

                </div>
                <Button type="submit" className="submit-btn">
                  <i className="fa-solid fa-plus"></i>
                </Button>
              </form>
            </div>
            <div className="allbutt">
              <Button onClick={deleteAllTodos}>Delete All</Button>
              <Button onClick={toggleAllTodos}>{allMarkedDone ? "Mark All Undone" : "Mark All Done"}</Button>
            </div>
            <ul className="taskList">
              {todos.map((todo) => (
                <li key={todo.id} className="task-item">
                  <div className="task-info">
                    <input
                      type="checkbox"
                      id={`checkbox-${todo.id}`}
                      checked={todo.completed}
                      onChange={() => toggleTaskStatus(todo.id)}
                    />
                    <label htmlFor={`checkbox-${todo.id}`}></label>
                    <span className={`task-text ${todo.completed ? "completed" : ""}`}>
                      {todo.title}
                    </span>
                    <span className="task-date">
                      {new Date(todo.deadline).toLocaleString()}
                    </span>
                  </div>
                  <div className="task-actions">
                    <Button onClick={() => toggleTaskStatus(todo.id)}>
                      {todo.completed ? "Undone" : "Done"}
                    </Button>
                    <Button onClick={() => startEditing(todo.id, todo.title, todo.deadline)}>
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Button>
                    <Button onClick={() => deleteTodo(todo.id)}>
                      <i className="fa-regular fa-trash-can"></i>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="roboto-slab">{editingTaskId ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-row">
              <label htmlFor="modalItem"></label>
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                type="text"
                id="modalItem"
                className="taskInput"
                placeholder="Add or edit task here..."
              />
            </div>
            <div className="form-row">
              <DateTimePicker
                onChange={setTaskDeadline}
                value={taskDeadline}
              />
            </div>
            <Button type="submit" className="submit-btn">
              {editingTaskId ? "Update Task" : "Add Task"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default App;
