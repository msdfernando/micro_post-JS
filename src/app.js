import { http } from './http';
import { ui } from './ui';

// get post on DOM load
document.addEventListener('DOMContentLoaded', getPosts);
// Listen for the add post 
document.querySelector('.post-submit').addEventListener('click', submitPost);
// Listen for delete
document.querySelector('#posts').addEventListener('click', deletePost);

// listen for edit state
document.querySelector('#posts').addEventListener('click', enableEdit);
// Listen for cancel 
document.querySelector('.card-form').addEventListener('click', cancelEdit);

// get post
function getPosts() {
  http.get('http://localhost:3000/posts')
    .then(data => ui.showPosts(data))
    .catch(err => console.log(err));
}
//submit post
function submitPost() {
  const title = document.querySelector('#title').value;
  const body = document.querySelector('#body').value;
  const id = document.querySelector('#id').value;
  const data = {
    title,
    body
  }
  // validate input
  if (title === '' || body === '') {
    ui.showAlert('please fill in all fields', 'alert alert-danger');
  } else {

    // check for ID
    if (id == '') {

      // create post
      http.post('http://localhost:3000/posts', data)
        .then(data => {
          ui.showAlert('Post added', 'alert alert-success');
          ui.clearFields();
          getPosts();
        })
        .catch(err => console.log(err));

    } else {
      // update post

      // creat post
      http.put(`http://localhost:3000/posts/${id}`, data)
        .then(data => {
          ui.showAlert('Post updated', 'alert alert-success');
          ui.changeFormState('add');
          getPosts();
        })
        .catch(err => console.log(err));

    }


  }
}

function deletePost(e) {
  if (e.target.parentElement.classList.contains('delete')) {
    const id = e.target.parentElement.dataset.id;
    if (confirm('Are you sure?')) {
      http.delete(`http://localhost:3000/posts/${id}`)
        .then(data => {
          ui.showAlert('Post deleted', 'alert alert-danger');
          getPosts();
        })
        .catch(err => console.log(err));

    }

  }
  e.preventDefault();
}

function enableEdit(e) {
  if (e.target.parentElement.classList.contains('edit')) {
    const id = e.target.parentElement.dataset.id;
    const body = e.target.parentElement.previousElementSibling.textContent;
    const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
    const data = {
      id,
      title,
      body
    }
    // fill from with current post
    ui.fillForm(data);
  }
  e.preventDefault();
}

// cancel edit state
function cancelEdit(e) {
  if (e.target.classList.contains('post-cancel')) {
    ui.changeFormState('add');
  }
  e.preventDefault();
}