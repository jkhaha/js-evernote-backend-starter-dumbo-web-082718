document.addEventListener('DOMContentLoaded', () => {
const sidenav = document.querySelector('.sidenav')
const main = document.querySelector('.main')
const noteContainer = document.querySelector('.note-container')
const formSubmitButton = document.querySelector('#new-note-form')
const inputOnForm = formSubmitButton.querySelector('#user_id_hidden')
const navBar = document.querySelector('.navbar')
formSubmitButton.addEventListener('submit', handleSubmit)
const editForm = document.querySelector("#edit-note-form")


fetchNotes()
fetchUser()

function fetchUser () {
  fetch('http://localhost:3000/api/v1/users')
    .then(res => res.json())
    .then(addUserToNavBar)
}

function addUserToNavBar(user) {
  const userObj = user[0]
  const h = document.createElement('h1')
  h.innerText = userObj.name
  navBar.append(h)
}

function fetchNotes(){
  fetch('http://localhost:3000/api/v1/notes')
  .then(res => res.json())
  .then(notes => notes.forEach(note => addNoteToSideBar(note)))
}

function addNoteToSideBar(note){
    const ul = document.createElement('ul')
    const li = document.createElement('li')
    li.innerText = note.title
    li.setAttribute('data-id', note.id)
    li.addEventListener('click', fetchNoteForMain)
    ul.append(li)
    sidenav.append(ul)
}

function fetchNoteForMain(event){
  const noteId = event.target.dataset.id
  fetch(`http://localhost:3000/api/v1/notes/${noteId}`)
  .then(res=>res.json())
  .then(showNoteOnMain)
}

function showNoteOnMain(note){
  noteContainer.innerHTML = ""
  const div = document.createElement('div')
  div.setAttribute('data-id', note.id)
  div.innerHTML =
  `<h4>${note.title}</h4>
  <p>${note.body}</p>
    <button id="edit-button">Edit</button>
  <button id="delete-button">Delete</button>`
  const deleteButton = div.querySelector('#delete-button')
  deleteButton.addEventListener('click', deleteANote)
  let editButtonClicked = false
  const editButton = div.querySelector('#edit-button')
  editButton.addEventListener('click', ()=>{
    editButtonClicked = !editButtonClicked
    if (editButtonClicked){
      editForm.style.display = 'block'
      editForm.addEventListener("submit", editNote)

    }
    else{
      editForm.style.display = 'none'
    }
  })

  noteContainer.append(div)

}

function editNote(event){
  // event.preventDefault()
  const editNoteId = event.target.previousElementSibling.firstChild.dataset.id
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      id: editNoteId,
      title: event.target.title.value,
      body: event.target.body.value,
      user_id: 1
    })
  }
  fetch(`http://localhost:3000//api/v1/notes/${editNoteId}`, options)
  // .then(resp => resp.json())
  // .then(note => {
  //   showNoteOnMain(note)
  //   const allLi = document.querySelectorAll(`li`)
  //   allLi.forEach(li => {
  //     if(li.dataset.id === editNoteId) {
  //       li.title.innerText = note.title
  //     }
  //   })
  // })
}




function handleSubmit(event) {
  event.preventDefault()
  const newTitle = event.target.title.value
  const newBody = event.target.body.value

  event.target.title.value = ""
  event.target.body.value = ""

  const object = {
    title: newTitle,
    body: newBody,
    user_id: 1
  }
  createNewNote(object)
}

function createNewNote(object){
  const options = {
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(object)
  }
  fetch('http://localhost:3000/api/v1/notes', options)
  .then(res => res.json())
  .then(addNoteToSideBar)
  }

function deleteANote(event){
  const noteIdToDelete = event.target.parentElement.dataset.id
  fetch(`http://localhost:3000//api/v1/notes/${noteIdToDelete}`, {
    method: "DELETE",
    headers: {
      "Content-Type" : "application/json"
    }
  })
  const allLi = document.querySelectorAll(`li`)
  allLi.forEach(function(li) {
    if(li.dataset.id === noteIdToDelete) {
      li.remove()
      noteContainer.innerText = ''
    }
  })
}


})
