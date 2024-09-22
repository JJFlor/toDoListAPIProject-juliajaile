import React, { useEffect, useState } from "react";


const Home = () => {
	const [todos, setTodos] = useState([]); //donde irán la lista de todos
	const [inputValue, setInputValue] = useState(""); //donde irá lo que se escriba en input
	const [filtered, setFiltered] = useState("all");



	useEffect(() => {
		fetchPostUser();
		fetchGetTask();
	}, []);


	//hace que el estado de inputValue sea igual a lo que se escribe en input
	const handleChange = (event) => {
		setInputValue(event.target.value);
	}

	const filteredTodos = todos?.filter(inputValue => {
		if (filtered === "completed") return inputValue.is_done;
		if (filtered === "pending") return !inputValue.is_done;
		return true;  // Si es "all", muestra todas las tareas
	});


	const handleAddClick = () => {
		fetchPostTask();
	}

	const fetchPostUser = () => {
		const nuevoUser = {
			label: inputValue,
			is_done: false
		}

		fetch('https://playground.4geeks.com/todo/users/julia', {
			method: "POST",
			body: JSON.stringify(nuevoUser),
			headers: {
				"Content-type": "application/json"
			}
		})
			.then(response => response.json())
			.then(data => {
				console.log(data);
			})
			.catch(error => console.log(error))// Manejo de errores)
	}


	const fetchGetTask = () => {
		fetch('https://playground.4geeks.com/todo/users/julia', {
			method: "GET",
		})
			.then(response => response.json())
			.then(data => {
				console.log(data) // Esto imprimirá en la consola el objeto exacto recibido del servidor
				setTodos(data.todos)
			})
			.catch(error => console.log(error))// Manejo de errores
	}


	const fetchPostTask = () => {
		const nuevaTarea = {
			label: inputValue,
			is_done: false
		}

		fetch('https://playground.4geeks.com/todo/todos/julia', {
			method: "POST",
			body: JSON.stringify(nuevaTarea),
			headers: {
				"Content-type": "application/json"
			}
		})
			.then(response => response.json())
			.then(data => {
				console.log(data);
				fetchGetTask();
			})
			.catch(error => console.log(error))// Manejo de errores)
	}

	const handleCheckBoxChange = (inputValue) => {
		const updatedTask = {
			...inputValue,
			is_done: !inputValue.is_done  // Cambia el estado de la tarea
		}
		fetch(`https://playground.4geeks.com/todo/todos/${inputValue.id}`, {
			method: "PUT",  // Usamos PUT para actualizar la tarea
			body: JSON.stringify(updatedTask),
			headers: {
				"Content-type": "application/json",
			},
		})
			.then(response => response.json())
			.then(data => {
				console.log(data);
				fetchGetTask();  // Vuelve a obtener la lista actualizada de tareas
			})
			.catch(error => console.log(error));
	}

	const fetchDeleteTask = (id) => {
		fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: "DELETE",
			headers: {
				"Content-type": "application/json"
			}
		})
			.then(response => response.json())
			.then(data => {
				console.log(data);
				fetchGetTask();
			})
			.catch(error => console.log(error))// Manejo de errores)
	}

	const fetchDeleteUser = () => {
		fetch('https://playground.4geeks.com/todo/users/julia', {
			method: "DELETE",
			headers: {
				"Content-type": "application/json"
			}
		})
			.then(response => console.log(response))
			.then(data => {
				console.log(data);
				fetchPostUser();
				setTodos([]);
			})
			.catch(error => console.log(error))// Manejo de errores)
	}



	return (
		<div className="container-fluid bg-black w-100 d-flex flex-column justify-content-center align-items-center ">
			<div className="backgroundList">
				<div className="container task-container d-flex flex-column justify-content-center align-items-center">
					<h2 className="title">What do you need to do?</h2>
					<form className="input-container">
						<input className="input" type="text" value={inputValue} onChange={handleChange} /*onKeyDown={handleKeyEnter}*/ />
						<button className="btn add-button" onClick={handleAddClick}>Add</button>
					</form>
					<div className="filter-buttons">
						<button className="btn filter-button me-4" onClick={() => setFiltered("all")}>All</button>
						<button className="btn filter-button me-4" onClick={() => setFiltered("completed")}>Completed</button>
						<button className="btn filter-button" onClick={() => setFiltered("pending")}>Pending</button>
					</div>
					<ul className="mt-3 d-flex flex-column justify-content-center align-items-center">
						{filteredTodos?.map((inputValue, index) => (
							<li className={`submittedInput d-flex align-items-center ${inputValue.is_done ? "completed-task" : "pending-task"}`} key={index}>
								<input
									type="checkbox"
									checked={inputValue.is_done}
									onChange={() => handleCheckBoxChange(inputValue)}
									className="checkbox-input"
								></input>
								<span>{inputValue.label}</span>
								<button className="closing-btn ms-3" onClick={() => fetchDeleteTask(inputValue.id)}>X</button>
							</li>
						))}
						{filteredTodos?.length <= 0 ? (
							<p className="submittedInput">No tasks, add a task</p>
						) : (<span><button className="btn delete-button" onClick={fetchDeleteUser}>Delete all tasks</button></span>)}
					</ul>
				</div>
			</div>
		</div>
	);
};


export default Home;
