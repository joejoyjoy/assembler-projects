import { fetchJSON } from './api.js';

const postsContainer = document.getElementById('posts');
const postTemplate = document.getElementById('post-template');

const modalEl = document.getElementById('post-modal');
const bsModal = new bootstrap.Modal(modalEl);
const modalTitle = document.getElementById('modal-title');
const modalBodyContent = document.getElementById('modal-body-content');
const modalUser = document.getElementById('modal-user');
const modalComments = document.getElementById('modal-comments');

let users = [];
let comments = [];
let posts = [];

async function init() {
    try {
        [users, comments, posts] = await Promise.all([
            fetchJSON('/users'),
            fetchJSON('/comments'),
            fetchJSON('/posts')
        ]);

        renderPosts(posts);
    } catch (err) {
        console.error(err);
    }
}

function getUserById(id) {
    return users.find(u => u.id.toString() === id.toString()) || { username: 'Unknown', email: '' };
}

function getCommentsForPost(postId) {
    return comments.filter(c => c.postId.toString() === postId.toString());
}

function renderPosts(postList) {
    postsContainer.innerHTML = '';
    const frag = document.createDocumentFragment();

    postList.forEach(post => {
        const clone = postTemplate.content.cloneNode(true);

        clone.querySelector('.post-title').textContent = post.id + ' ' + post.title;
        clone.querySelector('.post-body').textContent = post.body;

        const btn = clone.querySelector('.btn-view');
        btn.dataset.postId = post.id;
        btn.addEventListener('click', () => openPostModal(post.id));

        frag.appendChild(clone);
    });

    postsContainer.appendChild(frag);
}

function openPostModal(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    modalTitle.textContent = post.title;
    modalBodyContent.innerHTML = '';
    modalBodyContent.appendChild(createPostBodyNode(post));

    const user = getUserById(post.userId);
    modalUser.innerHTML = `<strong>Author:</strong> ${user.username} &nbsp; <a href="mailto:${user.email}">${user.email}</a>`;

    const postComments = getCommentsForPost(postId);
    renderComments(postComments);

    bsModal.show();
}

function createPostBodyNode(post) {
    const node = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = post.body;
    node.appendChild(p);
    return node;
}

function renderComments(list) {
    modalComments.innerHTML = '';
    if (list.length === 0) {
        modalComments.textContent = 'No comments yet.';
        return;
    }

    const frag = document.createDocumentFragment();
    list.forEach(c => {
        const d = document.createElement('div');
        d.className = 'comment';

        const name = document.createElement('div');
        name.innerHTML = `<strong>${c.name}</strong> <small>&lt;${c.email}&gt;</small>`;

        const body = document.createElement('div');
        body.textContent = c.body;

        d.appendChild(name);
        d.appendChild(body);
        frag.appendChild(d);
    });

    modalComments.appendChild(frag);
}

init();
