import { httpConnection as http } from './httpConnection';
let idToRemovePost;

const loadPosts = () => {
  let list = document.getElementById('posts');
  http().get(postsAPI).then((data) => {
    data.forEach(async post => {
      if (post) {
        let cloneList = list.children[0].cloneNode(true);
        cloneList.id = `post${post.id}`;
        cloneList.children[0].onclick = (e) => openModalPost(e);
        cloneList.children[0].textContent = post.title;
        cloneList.children[2].id = `trashPost${post.id}`;
        cloneList.children[2].children[0].id = `trashPost${post.id}`;
        cloneList.children[2].onclick = (e) => waitingIdToRemovePost(e);
        await http().get(commentsByPostAPI(post.id)).then((comments) => {
          cloneList.children[1].textContent = comments.length;
        });
        list.appendChild(cloneList);
      }
    });
  }).then(() => list.children[0].remove());
}

async function openModalPost(e) {
  let idUser;
  let id = e.target.parentElement.id.replace('post', '');
  await http().get(postByIdAPI(id)).then(res => {
    if (res) {
      idUser = res.userId;
      document.getElementById('modalContent').textContent = res.body;
      document.getElementById('showModalLabel').textContent = res.title;
    }
  });
  http().get(userByIdAPI(id)).then(data => {
    if (data) {
      document.getElementById('modalUser').innerHTML =
        `<p>Email - ${data.email}</p><p>Username - ${data.username}</p>`
    }
  });
}

function waitingIdToRemovePost(e) {
  idToRemovePost = e.target.id.replace('trashPost', '');
}

async function removePost() {
  await http().del(getPostByIdAPI + '/' + idToRemovePost);
  loadPosts();
}

loadPosts();
document.getElementById('finalRemovePost').addEventListener('click', removePost);
