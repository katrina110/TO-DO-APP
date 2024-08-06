import "./App.css";
import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [newTask, setNewTask] = useState("");
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
    if (newTask === "") return;
    if (editingTaskId) {
      // Update the existing task
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === editingTaskId ? { ...todo, title: newTask } : todo
        )
      );
      setEditingTaskId(null);
    } else {
      // Add a new task
      setTodos((currentTodos) => [
        ...currentTodos,
        { id: crypto.randomUUID(), title: newTask, completed: false },
      ]);
    }
    setNewTask("");
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

  function startEditing(id, title) {
    setEditingTaskId(id);
    setNewTask(title);
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
        <div className="roboto-slab apptitle">INTERN'S TO-DO LIST</div>
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
                </div>
                <Button type="submit">
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
      </div>
      <div className="task-actions">
        <Button onClick={() => toggleTaskStatus(todo.id)}>
          {todo.completed ? "Undone" : "Done"}
        </Button>
        <Button onClick={() => startEditing(todo.id, todo.title)}>
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
          <Modal.Title>{editingTaskId ? "Edit Task" : "Add Task"}</Modal.Title>
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
